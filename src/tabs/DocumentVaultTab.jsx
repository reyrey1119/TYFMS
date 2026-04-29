/*
  SUPABASE SETUP — run these in your Supabase SQL editor before using this feature:

  -- 1. Create vault_documents table
  CREATE TABLE IF NOT EXISTS public.vault_documents (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type text NOT NULL,
    filename      text NOT NULL,
    storage_path  text NOT NULL,
    file_size     integer,
    content_type  text,
    extracted_text text,
    extraction_summary jsonb,
    uploaded_at   timestamptz DEFAULT now()
  );

  ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users manage own vault docs"
    ON public.vault_documents FOR ALL
    USING  (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- 2. In Supabase Dashboard → Storage:
  --    Create bucket named "document-vault" (toggle Private ON)
  --    Add storage policy:
  --      Name: Users own folder
  --      Allowed operation: SELECT, INSERT, DELETE
  --      Policy: (storage.foldername(name))[1] = auth.uid()::text
*/

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import AuthModal from '../components/AuthModal'

const BUCKET = 'document-vault'
const MAX_FILE_MB = 15

const VAULT_CATS = [
  { id: 'jst',    label: 'JST',          fullLabel: 'Joint Service Transcript',               icon: '🎓', desc: 'Your official military education and training transcript. Includes ACE college credit recommendations for all your military courses and occupational experience.', accept: '.pdf,application/pdf' },
  { id: 'oer',    label: 'OER',          fullLabel: 'Officer Evaluation Report',             icon: '📊', desc: 'Annual, relief, and interim OERs' },
  { id: 'ncoer',  label: 'NCOER',        fullLabel: 'Non-Commissioned Officer Eval Report',   icon: '📊', desc: 'DA Form 2166-9 series' },
  { id: 'opb',    label: 'OPB',          fullLabel: 'Officer Promotion Board Bio/Photo',      icon: '📋', desc: 'Board bio and photo packet' },
  { id: 'epb',    label: 'EPB',          fullLabel: 'Enlisted Promotion Board Packet',        icon: '📋', desc: 'Promotion board packet' },
  { id: 'awards', label: 'Awards',       fullLabel: 'Award Citations',                        icon: '🎖️', desc: 'ARCOM, MSM, BSM, AAM, and others' },
  { id: 'dd214',  label: 'DD-214',       fullLabel: 'Certificate of Release (DD-214)',        icon: '📄', desc: 'All copies — long form preferred' },
  { id: 'resume', label: 'Resume / CV',  fullLabel: 'Previous Resume or CV',                 icon: '📝', desc: 'Any prior civilian or military bio' },
  { id: 'other',  label: 'Other',        fullLabel: 'Other Service Documents',                icon: '📁', desc: 'Training records, PT scores, certificates' },
]

const ACCEPT = '.pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,application/msword,.jpg,image/jpeg,.jpeg,.png,image/png'

function fmtSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fmtDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SummaryCard({ summary }) {
  if (!summary) return null
  const { ratingOverall, awards, keyBullets, veteranName, rank, unit, period } = summary
  const hasContent = ratingOverall || (awards?.length > 0) || (keyBullets?.length > 0)
  if (!hasContent) return null
  return (
    <div style={{ background: '#F5F9F5', border: '1px solid #B8DDB8', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#0A7868', marginBottom: 8 }}>
        Extraction summary
      </p>
      {(veteranName || rank || unit) && (
        <p style={{ fontSize: 12, color: '#1a1a18', marginBottom: 6, fontWeight: 500 }}>
          {[veteranName, rank, unit].filter(Boolean).join(' · ')}
          {period && <span style={{ color: '#5f5e5a', fontWeight: 400 }}> · {period}</span>}
        </p>
      )}
      {ratingOverall && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#0A7868', padding: '2px 8px', borderRadius: 20 }}>
            Overall rating
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0A7868' }}>{ratingOverall}</span>
        </div>
      )}
      {awards?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, color: '#5f5e5a', marginBottom: 4 }}>
            Awards found: {awards.join(', ')}
          </p>
        </div>
      )}
      {keyBullets?.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>Key accomplishments extracted:</p>
          {keyBullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
              <span style={{ color: '#0A7868', flexShrink: 0, marginTop: 1 }}>•</span>
              <p style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.55 }}>{b}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JstSummaryCard({ summary }) {
  if (!summary) return null
  const { coursesFound, occupationsFound, totalAceHours, mosCodes, veteranName, rank } = summary
  if (coursesFound == null && occupationsFound == null && !totalAceHours) return null
  return (
    <div style={{ background: '#F5F9F5', border: '1px solid #B8DDB8', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#0A7868', marginBottom: 8 }}>
        JST processed successfully
      </p>
      {(veteranName || rank) && (
        <p style={{ fontSize: 12, color: '#1a1a18', marginBottom: 8, fontWeight: 500 }}>
          {[veteranName, rank].filter(Boolean).join(' · ')}
        </p>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {coursesFound != null && (
          <div style={{ background: '#fff', border: '1px solid #B8DDB8', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1B3A6B', lineHeight: 1 }}>{coursesFound}</p>
            <p style={{ fontSize: 10, color: '#5f5e5a' }}>Courses found</p>
          </div>
        )}
        {occupationsFound != null && (
          <div style={{ background: '#fff', border: '1px solid #B8DDB8', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1B3A6B', lineHeight: 1 }}>{occupationsFound}</p>
            <p style={{ fontSize: 10, color: '#5f5e5a' }}>Occupations found</p>
          </div>
        )}
        {totalAceHours != null && (
          <div style={{ background: '#fff', border: '1px solid #B8DDB8', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#C07A28', lineHeight: 1 }}>{totalAceHours}</p>
            <p style={{ fontSize: 10, color: '#5f5e5a' }}>ACE credit hrs</p>
          </div>
        )}
      </div>
      {mosCodes?.length > 0 && (
        <p style={{ fontSize: 11, color: '#5f5e5a' }}>
          MOS codes identified: <strong style={{ color: '#1a1a18' }}>{mosCodes.join(', ')}</strong>
        </p>
      )}
    </div>
  )
}

export default function DocumentVaultTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [docs, setDocs] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [uploading, setUploading] = useState({})   // { [catId]: bool }
  const [uploadErrors, setUploadErrors] = useState({}) // { [catId]: string }
  const [extracting, setExtracting] = useState({}) // { [docId]: bool }
  const [extractErrors, setExtractErrors] = useState({}) // { [docId]: string }
  const [deleteConfirm, setDeleteConfirm] = useState(null) // docId
  const [deleting, setDeleting] = useState({})
  const [expandedDoc, setExpandedDoc] = useState(null)
  const [dragOver, setDragOver] = useState({}) // { [catId]: bool }
  const fileInputRefs = useRef({})

  useEffect(() => {
    if (!useDb) { setLoadingDocs(false); return }
    loadDocs()
  }, [useDb])

  async function loadDocs() {
    setLoadingDocs(true)
    try {
      const { data, error } = await supabase
        .from('vault_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
      if (!error && data) setDocs(data)
    } catch {}
    setLoadingDocs(false)
  }

  async function handleFiles(catId, files) {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      await uploadFile(catId, file)
    }
  }

  async function uploadFile(catId, file) {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadErrors(p => ({ ...p, [catId]: `File too large. Max ${MAX_FILE_MB} MB.` }))
      return
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword']
    if (!validTypes.some(t => file.type === t || file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'))) {
      setUploadErrors(p => ({ ...p, [catId]: 'Unsupported file type. Use PDF, DOCX, JPG, or PNG.' }))
      return
    }
    setUploadErrors(p => ({ ...p, [catId]: '' }))
    setUploading(p => ({ ...p, [catId]: true }))

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${user.id}/${catId}/${Date.now()}-${safeName}`

    try {
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (uploadErr) {
        setUploadErrors(p => ({ ...p, [catId]: uploadErr.message }))
        setUploading(p => ({ ...p, [catId]: false }))
        return
      }

      const { data: doc, error: dbErr } = await supabase
        .from('vault_documents')
        .insert({
          user_id: user.id,
          document_type: catId,
          filename: file.name,
          storage_path: storagePath,
          file_size: file.size,
          content_type: file.type || '',
        })
        .select()
        .single()

      setUploading(p => ({ ...p, [catId]: false }))
      if (dbErr || !doc) return

      setDocs(prev => [doc, ...prev])
      extractDoc(doc)
    } catch {
      setUploadErrors(p => ({ ...p, [catId]: 'Upload failed. Try again.' }))
      setUploading(p => ({ ...p, [catId]: false }))
    }
  }

  async function extractDoc(doc) {
    setExtracting(p => ({ ...p, [doc.id]: true }))
    setExtractErrors(p => ({ ...p, [doc.id]: '' }))
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const r = await fetch('/api/resume-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vault-extract',
          storagePath: doc.storage_path,
          contentType: doc.content_type,
          documentType: doc.document_type,
          accessToken: session?.access_token,
        }),
      })
      const result = await r.json()
      if (result.error) {
        setExtractErrors(p => ({ ...p, [doc.id]: result.error }))
      } else {
        const { error: updateErr } = await supabase
          .from('vault_documents')
          .update({ extracted_text: result.extractedText, extraction_summary: result.summary })
          .eq('id', doc.id)
        if (!updateErr) {
          setDocs(prev => prev.map(d => d.id === doc.id
            ? { ...d, extracted_text: result.extractedText, extraction_summary: result.summary }
            : d
          ))
        }
      }
    } catch {
      setExtractErrors(p => ({ ...p, [doc.id]: 'Extraction failed.' }))
    }
    setExtracting(p => ({ ...p, [doc.id]: false }))
  }

  async function deleteDoc(doc) {
    setDeleting(p => ({ ...p, [doc.id]: true }))
    try {
      await supabase.storage.from(BUCKET).remove([doc.storage_path])
      await supabase.from('vault_documents').delete().eq('id', doc.id)
      setDocs(prev => prev.filter(d => d.id !== doc.id))
    } catch {}
    setDeleteConfirm(null)
    setDeleting(p => ({ ...p, [doc.id]: false }))
  }

  // ── Counts ─────────────────────────────────────────────────────────────────
  const totalDocs = docs.length
  const extractedCount = docs.filter(d => d.extracted_text).length

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div>
        <p className="sec-title">Document Vault</p>
        <p className="sec-sub">
          Securely store your service documents so the AI can build accurate, record-based resumes and skill translations.
        </p>
        <div style={{
          background: '#fff', border: '1px solid #E5E3DC', borderRadius: 16,
          padding: '40px 28px', textAlign: 'center', marginBottom: 20,
        }}>
          <p style={{ fontSize: 36, marginBottom: 16 }}>🔒</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a18', marginBottom: 10 }}>
            Sign in to access your Document Vault
          </p>
          <p style={{ fontSize: 14, color: '#5f5e5a', lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            Sign in to securely store your service documents. Your records are used to generate accurate, personalized resumes based on your actual military performance.
          </p>
          <button
            className="btn-g"
            onClick={() => setShowAuthModal(true)}
            style={{ maxWidth: 240, margin: '0 auto' }}
          >
            Sign in to TYFMS
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { icon: '🎖️', title: 'Award citations', desc: 'AI reads your ARCOM, MSM, and BSM citations and extracts specific accomplishments for your resume' },
            { icon: '📊', title: 'Evaluation reports', desc: 'OERs and NCOERs contain your strongest leadership bullets — the AI uses them verbatim' },
            { icon: '📄', title: 'DD-214', desc: 'Your discharge record confirms your rank, MOS, and total time in service for accurate documentation' },
          ].map(c => (
            <div key={c.title} style={{ flex: '1 1 180px', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    )
  }

  if (!supabaseEnabled) {
    return (
      <div>
        <p className="sec-title">Document Vault</p>
        <div className="warn"><p>Document Vault requires a database connection. Contact support if this persists.</p></div>
      </div>
    )
  }

  // ── Authenticated view ─────────────────────────────────────────────────────
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#b4b2a9', marginBottom: 4 }}>
        Your Service Record
      </p>
      <p className="sec-title">Document Vault</p>
      <p className="sec-sub">
        Upload your service documents once. Every resume and skill translation you generate will be built from your actual record — specific accomplishments, real ratings, and cited awards — not generic templates.
      </p>

      {/* Stats bar */}
      {totalDocs > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#1B3A6B', lineHeight: 1, marginBottom: 4 }}>{totalDocs}</p>
            <p style={{ fontSize: 11, color: '#5f5e5a' }}>Documents stored</p>
          </div>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0A7868', lineHeight: 1, marginBottom: 4 }}>{extractedCount}</p>
            <p style={{ fontSize: 11, color: '#5f5e5a' }}>Ready for AI use</p>
          </div>
          <div style={{ flex: 2, background: extractedCount === totalDocs && totalDocs > 0 ? '#F0F7EE' : '#FFFBF0', border: `1px solid ${extractedCount === totalDocs && totalDocs > 0 ? '#B8DDB8' : '#F5E0A0'}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{extractedCount === totalDocs && totalDocs > 0 ? '✅' : '⏳'}</span>
            <p style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.5 }}>
              {extractedCount === totalDocs && totalDocs > 0
                ? 'All documents processed. Resume Builder and Skills Translator will use your record.'
                : `${totalDocs - extractedCount} document${totalDocs - extractedCount !== 1 ? 's' : ''} still processing.`}
            </p>
          </div>
        </div>
      )}

      {/* Category upload zones */}
      {loadingDocs ? (
        <p style={{ fontSize: 13, color: '#b4b2a9', textAlign: 'center', padding: '32px 0' }}>Loading your vault…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {VAULT_CATS.map(cat => {
            const catDocs = docs.filter(d => d.document_type === cat.id)
            const isUploading = uploading[cat.id]
            const uploadErr = uploadErrors[cat.id]
            const isDragOver = dragOver[cat.id]
            const catAccept = cat.accept || ACCEPT
            const isJst = cat.id === 'jst'

            return (
              <div key={cat.id} style={{ background: '#fff', border: `1px solid ${isJst ? '#C07A28' : '#E5E3DC'}`, borderRadius: 14, overflow: 'hidden' }}>
                {/* Category header */}
                <div style={{ padding: '14px 18px', borderBottom: catDocs.length > 0 ? '1px solid #F0EDE6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 18 }}>{cat.icon}</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a18' }}>{cat.label}</p>
                      <span style={{ fontSize: 11, color: '#b4b2a9' }}>{cat.fullLabel}</span>
                      {isJst && <span style={{ fontSize: 10, fontWeight: 700, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.06em' }}>Recommended</span>}
                    </div>
                    <p style={{ fontSize: 12, color: '#5f5e5a', marginLeft: 26, lineHeight: 1.6 }}>{cat.desc}</p>
                    {isJst && (
                      <div style={{ marginLeft: 26, marginTop: 10 }}>
                        <a
                          href="https://jst.doded.mil"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#fff',
                            background: '#C07A28', borderRadius: 7, padding: '5px 12px',
                            textDecoration: 'none', marginBottom: 8,
                          }}
                        >
                          Get your JST →
                        </a>
                        <p style={{ fontSize: 11, color: '#5f5e5a', lineHeight: 1.6, maxWidth: 420 }}>
                          Most veterans don't know this exists. Your JST documents every military course you completed and recommends college credit for them. It takes about 10 minutes to create an account and download your transcript.
                        </p>
                      </div>
                    )}
                    {uploadErr && <p style={{ fontSize: 12, color: '#a32d2d', marginLeft: 26, marginTop: 4 }}>{uploadErr}</p>}
                  </div>
                  <div
                    style={{
                      border: `2px dashed ${isDragOver ? '#1B3A6B' : '#d3d1c7'}`,
                      borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                      background: isDragOver ? '#EEF3FC' : '#FAFAF8',
                      transition: 'all .15s', flexShrink: 0, textAlign: 'center',
                      minWidth: 110,
                    }}
                    onClick={() => fileInputRefs.current[cat.id]?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(p => ({ ...p, [cat.id]: true })) }}
                    onDragLeave={() => setDragOver(p => ({ ...p, [cat.id]: false }))}
                    onDrop={e => { e.preventDefault(); setDragOver(p => ({ ...p, [cat.id]: false })); handleFiles(cat.id, e.dataTransfer.files) }}
                  >
                    {isUploading ? (
                      <p style={{ fontSize: 12, color: '#1B3A6B' }}>Uploading…</p>
                    ) : (
                      <>
                        <p style={{ fontSize: 18, marginBottom: 2 }}>📎</p>
                        <p style={{ fontSize: 11, color: '#1B3A6B', fontWeight: 600 }}>Upload</p>
                        <p style={{ fontSize: 10, color: '#b4b2a9' }}>{isJst ? 'PDF only' : 'PDF · DOCX · JPG · PNG'}</p>
                      </>
                    )}
                    <input
                      ref={el => fileInputRefs.current[cat.id] = el}
                      type="file"
                      multiple
                      accept={catAccept}
                      style={{ display: 'none' }}
                      onChange={e => handleFiles(cat.id, e.target.files)}
                    />
                  </div>
                </div>

                {/* File list */}
                {catDocs.length > 0 && (
                  <div style={{ padding: '8px 18px 14px' }}>
                    {catDocs.map(doc => {
                      const isExtracting = extracting[doc.id]
                      const extractErr = extractErrors[doc.id]
                      const hasExtracted = !!doc.extracted_text
                      const isExpanded = expandedDoc === doc.id
                      const isDeleting = deleting[doc.id]
                      const isDeleteConfirm = deleteConfirm === doc.id

                      return (
                        <div key={doc.id} style={{ borderTop: '1px solid #F0EDE6', paddingTop: 10, marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                              {doc.content_type?.startsWith('image/') ? '🖼️'
                                : doc.content_type?.includes('word') ? '📝'
                                : '📄'}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.filename}
                              </p>
                              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                                <p style={{ fontSize: 11, color: '#b4b2a9' }}>{fmtDate(doc.uploaded_at)}</p>
                                {doc.file_size && <p style={{ fontSize: 11, color: '#b4b2a9' }}>{fmtSize(doc.file_size)}</p>}
                                {isExtracting && (
                                  <span style={{ fontSize: 11, color: '#C07A28', fontWeight: 500 }}>⏳ Reading document…</span>
                                )}
                                {!isExtracting && hasExtracted && (
                                  <span style={{ fontSize: 11, color: '#0A7868', fontWeight: 500 }}>✓ Ready for AI use</span>
                                )}
                                {!isExtracting && !hasExtracted && !extractErr && (
                                  <span style={{ fontSize: 11, color: '#b4b2a9' }}>Pending extraction</span>
                                )}
                                {extractErr && (
                                  <span style={{ fontSize: 11, color: '#a32d2d' }}>⚠ {extractErr}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              {hasExtracted && (
                                <button
                                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                                  style={{ padding: '3px 10px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#1B3A6B' }}
                                >
                                  {isExpanded ? 'Hide' : 'Summary'}
                                </button>
                              )}
                              {extractErr && (
                                <button
                                  onClick={() => extractDoc(doc)}
                                  style={{ padding: '3px 10px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#C07A28' }}
                                >
                                  Retry
                                </button>
                              )}
                              {isDeleteConfirm ? (
                                <>
                                  <button
                                    onClick={() => deleteDoc(doc)}
                                    disabled={isDeleting}
                                    style={{ padding: '3px 10px', background: '#a32d2d', border: 'none', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#fff', fontWeight: 700 }}
                                  >
                                    {isDeleting ? '…' : 'Delete'}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    style={{ padding: '3px 8px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(doc.id)}
                                  style={{ padding: '3px 8px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#a32d2d' }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                          {isExpanded && (isJst
                            ? <JstSummaryCard summary={doc.extraction_summary} />
                            : <SummaryCard summary={doc.extraction_summary} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {catDocs.length === 0 && !isUploading && (
                  <div />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Privacy note */}
      <div style={{ marginTop: 24, padding: '14px 18px', background: '#F5F4F0', borderRadius: 10 }}>
        <p style={{ fontSize: 11, color: '#5f5e5a', lineHeight: 1.7 }}>
          <strong style={{ color: '#1a1a18' }}>Security:</strong> Your documents are stored in a private, user-isolated storage bucket. Files are accessible only to your account. No other user can view, access, or retrieve your service records. Extracted text is used solely to improve your resume and skill translation results.
        </p>
      </div>
    </div>
  )
}
