/**
 * @param {string} text
 * @returns {string[]}
 */
export function parseSubBreeds(text) {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
