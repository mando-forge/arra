const SAFETY_LABEL = /\s*(?:(?:user|response)\s+safety|safety\s+(?:classification|assessment))\s*:\s*(?:safe|unsafe|unknown|allowed|disallowed)\s*[,;:.-]?\s*/iy

/** Removes provider moderation metadata that is not part of the visitor answer. */
export function sanitizeAssistantResponse(value: string) {
  let output = value.replace(/^\s+/, "")
  let previous = ""

  while (output !== previous) {
    previous = output
    SAFETY_LABEL.lastIndex = 0
    const match = SAFETY_LABEL.exec(output)
    if (match?.index === 0) output = output.slice(match[0].length)
  }

  return output.replace(/^\s*[,;:-]+\s*/, "").trimStart()
}
