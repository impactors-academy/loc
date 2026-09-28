// Listing titles arrive from the admin as "Villa Mima — Marrakech" or
// "Hammam Ritual | Marrakech". The site doesn't print dashes or pipes: the part after
// the separator becomes a quieter second line. Metadata and JSON-LD keep the
// original string.
const TITLE_SEPARATOR = /\s+[—–|]\s+/

export function splitTitle(title: string): { name: string; detail: string | null } {
  const match = title.match(TITLE_SEPARATOR)
  if (!match || match.index === undefined) return { name: title, detail: null }
  return {
    name: title.slice(0, match.index).trim(),
    detail: title.slice(match.index + match[0].length).trim() || null,
  }
}

// Em dashes inside running copy read as a clause break; a comma carries the
// same pause without the look.
export function tidyDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ", ")
}
