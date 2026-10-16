// One honest status card for the military reference lookup, shared by the
// Skills translator and the Resume builder. It says exactly what the app has
// (verified source, unverified stored text, an AI draft, or nothing) and never
// implies the reference describes what the person personally did.

const TONES = {
  verified:   { bg: '#fff',     border: '#1B3A6B', title: '#1B3A6B' },
  stale:      { bg: '#FBF3E2',  border: '#C07A28', title: '#8A5416' },
  unverified: { bg: '#FBF3E2',  border: '#C07A28', title: '#8A5416' },
  ai_only:    { bg: '#EFE7CD',  border: '#C2B588', title: '#5C5646' },
  plain:      { bg: '#EFE7CD',  border: '#C2B588', title: '#5C5646' },
}

const HEADLINES = {
  verified:   'Verified reference',
  stale:      'Reference not re-checked recently',
  unverified: 'Stored reference — publication version not recorded',
  ai_only:    'No official reference on file — AI-written draft',
}

function fmtDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  // UTC on purpose: a publication date like 2024-07-19 must not slip to the 18th in US time zones.
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function Box({ tone, children }) {
  const t = TONES[tone] || TONES.plain
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#211F19' }}>
      {children}
    </div>
  )
}

export default function MilReferenceCard({
  status,            // 'idle' | 'needs_rank' | 'loading' | 'failed' | 'done'
  data,              // server result when status === 'done'
  rank,
  juniorContext,
  onUseDraft,        // (text) => void — copies an AI draft into the person's own duties box
  onPickCode,        // (code) => void — "did you mean"
  confirmable,       // show the "I performed these duties" checkbox
  confirmed,
  onConfirmChange,
}) {
  if (status === 'idle') return null

  if (status === 'needs_rank') {
    return <Box tone="plain">Select your <strong>rank</strong> to load guidance for your grade. Scope differs a lot between a junior and a senior member of the same specialty, so we don't guess.</Box>
  }

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#EFE7CD', borderRadius: 8, marginBottom: 12, fontSize: 13, color: '#5C5646' }}>
        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #1B3A6B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
        Looking up the stored reference...
      </div>
    )
  }

  if (status === 'failed' || !data) {
    return (
      <Box tone="plain">
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Reference lookup unavailable</p>
        <p style={{ fontSize: 12, lineHeight: 1.5 }}>You can still continue. Describe what you did below and your result will be built from that.</p>
      </Box>
    )
  }

  const { status: s } = data

  // Gaps: nothing usable on file.
  if (s === 'none' || s === 'source_error' || s === 'needs_input' || s === 'invalid_input') {
    return (
      <Box tone="plain">
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{s === 'source_error' ? 'Reference temporarily unavailable' : 'No official reference on file'}</p>
        <p style={{ fontSize: 12, lineHeight: 1.5 }}>{data.message}</p>
        {data.similar?.length > 0 && onPickCode && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {data.similar.map(c => (
              <button key={c.code} type="button" onClick={() => onPickCode(c.code)}
                style={{ padding: '4px 10px', background: '#fff', border: '1px solid #C2B588', borderRadius: 14, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#1B3A6B' }}>
                {c.code} — {c.title}
              </button>
            ))}
          </div>
        )}
      </Box>
    )
  }

  const tone = TONES[s] ? s : 'plain'
  const t = TONES[tone]
  const sources = data.sources || []
  const sections = data.sections || []
  const sourceById = Object.fromEntries(sources.map(src => [src.id, src]))
  const hasDraftText = s === 'ai_only' && (data.duties_and_responsibilities || data.key_skills)
  const SECTION_TITLES = {
    general_duties: 'Typical duties', rank_duties: 'Expected at this grade', assignments: 'Possible assignments (not confirmed)',
    training: 'Recommended training (not proof it was completed)', credentials: 'Recommended credentials (not proof they were earned)',
    self_development: 'Self-development', lifelong_learning: 'Lifelong learning', development: 'Career development guidance', prerequisites: 'Prerequisites',
  }
  const COMPONENT_TITLES = { active: 'Active', reserve: 'Reserve', guard: 'National Guard' }

  return (
    <Box tone={tone}>
      <p style={{ color: t.title, fontWeight: 700, marginBottom: 2 }}>{HEADLINES[s] || 'Reference'}</p>
      {data.duty_title && <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{data.duty_title}{data.request?.payGrade ? ` · ${data.request.payGrade}` : ''}</p>}

      {s === 'ai_only' ? (
        <p style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.5, marginBottom: 6 }}>
          This draft was written by an AI model, not taken from an official publication. It may be incomplete or wrong. Edit it into your own words before using it.
        </p>
      ) : sources.length > 0 ? (
        <div style={{ marginBottom: 6 }}>
          {sources.map(src => (
            <p key={src.id} style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.5, marginBottom: 2 }}>
              <strong>{src.ref}</strong> · {[src.publicationNumber, src.chapter].filter(Boolean).join(', ') || src.title}
              {src.publicationDate && <> · published {fmtDate(src.publicationDate)}</>}
              {src.lastChecked && <> · checked {fmtDate(src.lastChecked)}</>}
              {src.status === 'stale' && <> · <em>not re-checked recently</em></>}
              {src.url && <> · <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1B3A6B' }}>View source</a></>}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.5, marginBottom: 6 }}>{data.document_source}</p>
      )}

      {data.codeNote && <p style={{ fontSize: 12, color: '#5C5646', marginBottom: 6 }}>{data.codeNote}</p>}
      {data.rank_note && <p style={{ fontSize: 12, color: '#5C5646', marginBottom: 6 }}>{data.rank_note}</p>}
      {data.componentNote && <p style={{ fontSize: 12, color: '#8A5416', marginBottom: 6 }}>{data.componentNote}</p>}

      <p style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.5, marginBottom: (sections.length || hasDraftText) ? 6 : 0 }}>
        This is background information about the specialty. Only sections explicitly labeled for a grade describe that grade. It is not a record of what <em>you</em> did, and recommended training or assignments are not proof anyone completed them.
        {juniorContext && ' If you are still in training, separate what you have trained on from what you have actually performed.'}
      </p>

      {(sections.length > 0 || hasDraftText) && (
        <details style={{ fontSize: 12, color: '#5C5646' }}>
          <summary style={{ cursor: 'pointer', color: '#1B3A6B', fontWeight: 600 }}>See what this covers</summary>
          <div style={{ marginTop: 6, maxHeight: 260, overflowY: 'auto', lineHeight: 1.55 }}>
            {sections.map((sec, i) => {
              const src = sourceById[sec.sourceId]
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p style={{ fontWeight: 700, color: '#211F19' }}>
                    {SECTION_TITLES[sec.section] || sec.section}{sec.heading ? ` — ${sec.heading}` : ''}
                    {sec.rankBand && <span style={{ fontWeight: 400, color: '#8F8768' }}> · {sec.rankBand}</span>}
                    {sec.components && <span style={{ fontWeight: 400, color: '#8F8768' }}> · {sec.components.split(',').map(c => COMPONENT_TITLES[c] || c).join(' / ')}</span>}
                  </p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{sec.text}</p>
                  <p style={{ fontSize: 11, color: '#8F8768' }}>
                    {src ? <>{sec.sourceRef} · {[src.publicationNumber, src.chapter].filter(Boolean).join(', ') || src.title}</> : 'Stored text — source version not recorded'}
                    {sec.pdfPages && <> · PDF p. {sec.pdfPages}</>}
                  </p>
                </div>
              )
            })}
            {hasDraftText && (
              <>
                {data.duties_and_responsibilities && <p style={{ marginBottom: 6, whiteSpace: 'pre-wrap' }}><strong>Draft tasks:</strong> {data.duties_and_responsibilities}</p>}
                {data.key_skills && <p style={{ marginBottom: 6 }}><strong>Draft skills:</strong> {data.key_skills}</p>}
              </>
            )}
          </div>
        </details>
      )}

      {s === 'ai_only' && onUseDraft && (
        <button type="button" onClick={() => onUseDraft([data.duties_and_responsibilities, data.key_skills && `Skills: ${data.key_skills}`].filter(Boolean).join('\n'))}
          style={{ marginTop: 8, padding: '6px 12px', background: '#fff', border: '1px solid #C2B588', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#1B3A6B' }}>
          Use as a starting point for my duties
        </button>
      )}

      {confirmable && s !== 'ai_only' && sections.length > 0 && (
        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10, fontSize: 12, color: '#211F19', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!confirmed} onChange={e => onConfirmChange?.(e.target.checked)} style={{ marginTop: 2 }} />
          <span>I personally performed these typical duties — you may write them as my experience. <span style={{ color: '#8F8768' }}>(Leave unchecked and your resume uses this only for wording; add your own details below.)</span></span>
        </label>
      )}
    </Box>
  )
}
