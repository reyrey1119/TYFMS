// Document Vault storage + database operations. Every failure is returned to the caller as a message the person can read;
// nothing is reported as done unless it was checked.
//
// Upload: file to storage, then a row in vault_documents. If the row cannot be written, the just-uploaded file is removed
// again (and the removal is verified); a failed cleanup is reported, never hidden.
// Delete: the stored file is removed and verified gone, then the row is deleted and verified gone.

function splitPath(path) {
  const i = path.lastIndexOf('/')
  return { dir: path.slice(0, i), name: path.slice(i + 1) }
}

// true / false, or null when it cannot be determined
export async function storageHas(supabase, bucket, path) {
  const { dir, name } = splitPath(path)
  try {
    const { data, error } = await supabase.storage.from(bucket).list(dir, { limit: 100, search: name })
    if (error || !Array.isArray(data)) return null
    return data.some(o => o.name === name)
  } catch { return null }
}

async function rowHas(supabase, id) {
  try {
    const { data, error } = await supabase.from('vault_documents').select('id').eq('id', id)
    if (error || !Array.isArray(data)) return null
    return data.length > 0
  } catch { return null }
}

async function removeStored(supabase, bucket, path) {
  let removeError = null
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) removeError = error.message || 'storage error'
  } catch (e) { removeError = e?.message || 'storage error' }
  const still = await storageHas(supabase, bucket, path)
  if (still === false) return { ok: true }
  if (removeError) return { ok: false, reason: removeError }
  return { ok: false, reason: still === true ? 'the file is still in storage' : 'removal could not be confirmed' }
}

export async function uploadVaultDocument({ supabase, bucket, userId, catId, file, now = Date.now }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${userId}/${catId}/${now()}-${safeName}`
  try {
    const { error: uploadErr } = await supabase.storage.from(bucket).upload(storagePath, file, { contentType: file.type, upsert: false })
    if (uploadErr) return { error: `Upload failed: ${uploadErr.message}` }
  } catch (e) { return { error: `Upload failed: ${e?.message || 'could not reach storage'}` } }

  let doc = null, dbMessage = ''
  try {
    const { data, error } = await supabase.from('vault_documents').insert({
      user_id: userId, document_type: catId, filename: file.name, storage_path: storagePath, file_size: file.size, content_type: file.type || '',
    }).select().single()
    if (error || !data) dbMessage = error?.message || 'no record was returned'
    else doc = data
  } catch (e) { dbMessage = e?.message || 'could not reach the database' }
  if (doc) return { doc }

  const cleanup = await removeStored(supabase, bucket, storagePath)
  if (cleanup.ok) return { error: `Your document was not saved: the record could not be created (${dbMessage}). The uploaded file was removed, so nothing was kept. Try again, and contact support if it keeps happening.` }
  return { error: `Your document was not saved: the record could not be created (${dbMessage}), and the uploaded file could not be removed (${cleanup.reason}). Contact support and mention the file name ${file.name}.` }
}

export async function deleteVaultDocument({ supabase, bucket, doc }) {
  const stored = await removeStored(supabase, bucket, doc.storage_path)
  if (!stored.ok) return { error: `Not deleted: the stored file could not be removed (${stored.reason}). The document is still in your Vault. Try again.` }

  let rowError = null
  try {
    const { error } = await supabase.from('vault_documents').delete().eq('id', doc.id)
    if (error) rowError = error.message || 'database error'
  } catch (e) { rowError = e?.message || 'database error' }
  const left = await rowHas(supabase, doc.id)
  if (left === false) return { ok: true }
  return { error: `Only partly deleted: the stored file was removed but its record could not be (${rowError || (left === true ? 'the record is still there' : 'removal could not be confirmed')}). Press Delete again.` }
}
