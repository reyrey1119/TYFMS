// What the official career guides RECOMMEND at this specialty and rank (training, credentials, assignments, self-development).
// It is shown as guidance only: nothing here says the person did any of it, and none of it feeds the resume.
import { useState } from 'react'

function Item({ item }) {
  const [open, setOpen] = useState(false)
  const long = item.text.length > 420
  const where = [item.source.publication, item.source.pdfPages ? `PDF p. ${item.source.pdfPages}` : null].filter(Boolean).join(', ')
  return (
    <div style={{ padding: '8px 0', borderTop: '1px solid #E4DBBC' }}>
      {item.heading && <p style={{ fontSize: 12, fontWeight: 600, color: '#211F19', marginBottom: 3 }}>{item.heading}</p>}
      <p style={{ fontSize: 13, color: '#3B372B', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{long && !open ? item.text.slice(0, 420) + '…' : item.text}</p>
      {long && <button type="button" onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#1B3A6B', fontSize: 12, cursor: 'pointer', padding: 0 }}>{open ? 'Show less' : 'Show more'}</button>}
      {where && <p style={{ fontSize: 11, color: '#8F8768', marginTop: 3 }}>{item.source.url ? <a href={item.source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8F8768' }}>From {where}</a> : `From ${where}`}</p>}
    </div>
  )
}

export default function DevelopmentGuidance({ groups }) {
  if (!groups || !groups.length) return null
  return (
    <div style={{ marginBottom: 20 }} data-testid="development-guidance">
      <p className="cat-label">Recommended for your specialty and rank</p>
      <p style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.55, margin: '4px 0 10px' }}>
        This is what the Army's career guides recommend. These are suggestions, <strong>not things you did</strong>: list a course, credential or assignment on a resume only if it is true for you.
      </p>
      {groups.map(g => (
        <details key={g.section} className="card" style={{ padding: '10px 14px', marginBottom: 8 }}>
          <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#211F19' }}>{g.label} ({g.items.length})</summary>
          {g.items.map((it, i) => <Item key={i} item={it} />)}
        </details>
      ))}
    </div>
  )
}
