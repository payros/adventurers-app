// Converts snake_case classes to Title Case class string
function fromSnakeCaseToTitleCase(string) {
  string = string.replace(/_/g, ' ')
  return string.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export { fromSnakeCaseToTitleCase }
