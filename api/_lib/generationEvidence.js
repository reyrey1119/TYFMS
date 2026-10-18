// Official specialty context must come from a reviewed source of an official publication.
// Legacy rows and model-written drafts may be displayed with their warning, but must not become
// authoritative inputs to either generator. A reviewed source that has simply not been re-checked recently
// ('stale') is still the official text; it is used, and the person is told it was last checked on a given date.
export function reviewedGenerationReference(reference) {
  // Needs at least one section that describes the work. A reference holding only recommended training or assignments is not
  // something to write from.
  return (reference?.status === 'verified' || reference?.status === 'stale') && reference.sections?.some(sec => isDutySection(sec.section))
    ? reference
    : null
}

import { officialTitle } from './armyCodeStatus.js'
import { isDutySection } from './milReference.js'

export const NO_REVIEWED_REFERENCE = 'No reviewed, recently checked reference is available for this specialty, rank and component. Do not infer duties, skills, systems, training, leadership scope or credentials from the occupational code or rank. Use only the facts the person supplied. Leave missing experience as [ADD: ...] prompts.';

// With no reviewed reference, the ONLY thing we may say about what an Army code is, is its official title.
// Without it a model fills the gap from memory and can name the wrong aircraft, system or branch.
export function codeIdentityBlock({ branch, category, code }) {
  if (branch !== 'Army') return ''
  const title = officialTitle(category, code)
  if (!title) return ''
  return `\n\nOFFICIAL TITLE of Army occupational code ${code} (DA PAM 611-21): "${title}". This title is the only verified fact about what the code is. Do not name any aircraft, weapon, system, equipment, unit type or branch that the person did not state, and do not describe the specialty from memory.`
}

// Rules that apply to every generation, with or without a reference.
export const NO_EMBELLISHMENT = 'Describe each task only as the person described it. Do not add results, effects, qualities or benefits the person did not state (for example "ensuring accuracy", "reducing risk", "demonstrating reliability", "before sign-off"). Do not invent a civilian job title as if the person held it: put any suggested civilian equivalent in [CONFIRM: ...] brackets.'
