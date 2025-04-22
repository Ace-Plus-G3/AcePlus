export const convertToReadableFormat = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B' // Convert to billions
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + 'M' // Convert to millions with flexible decimals
  } else if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k' // Convert to thousands with flexible decimals
  } else {
    return value.toString() // If less than 1000, return the original number
  }
}

export const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US') // Formats as "100,000"
}
