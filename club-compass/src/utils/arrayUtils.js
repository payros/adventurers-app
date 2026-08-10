/**
 * Filters an array of objects, returning items where ANY of the given propKeys
 * contains filterVal as a case-insensitive substring.
 * @param {Array} arr
 * @param {string[]} propKeys
 * @param {string} filterVal
 */
export function filterByProps(arr, propKeys, filterVal) {
  if (!filterVal) return arr
  const lower = filterVal.toLowerCase()
  return arr.filter((item) => propKeys.some((key) => item[key]?.toString().toLowerCase().includes(lower)))
}
