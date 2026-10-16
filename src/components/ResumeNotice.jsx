// Shown above a generated resume when it contains lines the person still has to confirm or complete.
export default function ResumeNotice({ text }) {
  const t = String(text || '')
  const confirm = /\[CONFIRM/.test(t)
  const add = /\[ADD/.test(t)
  if (!confirm && !add) return null
  return (
    <div role="note" style={{ background: '#FBF3E1', border: '1px solid #E3C77E', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, lineHeight: 1.55, color: '#5A4310' }}>
      <strong>Review before you use this draft.</strong>
      {confirm && <> Lines marked <strong>[CONFIRM]</strong> describe what your role typically involves according to the official publication. They are not a record of what you did. Keep only the ones that apply to you and delete the rest.</>}
      {add && <> Lines marked <strong>[ADD]</strong> need your own details.</>}
      {' '}Everything under <strong>YOUR ACCOMPLISHMENTS</strong> comes only from what you told us or your uploaded records.
    </div>
  )
}
