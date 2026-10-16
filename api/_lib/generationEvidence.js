// Official specialty context must come from a reviewed, recently checked source.
// Legacy rows and model-written drafts may be displayed with their warning, but
// must not become authoritative inputs to either generator.
export function reviewedGenerationReference(reference) {
  return reference?.status === 'verified' && reference.sections?.length
    ? reference
    : null
}

export const NO_REVIEWED_REFERENCE = 'No reviewed, recently checked reference is available for this specialty, rank and component. Do not infer duties, skills, systems, training, leadership scope or credentials from the occupational code or rank. Use only the facts the person supplied. Leave missing experience as [ADD: ...] prompts.';
