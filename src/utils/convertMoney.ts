export const convertToReadableFormat = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M' // Convert to millions with one decimal
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k' // Convert to thousands with one decimal
  } else {
    return value.toString() // If less than 1000, return the original number
  }
}
