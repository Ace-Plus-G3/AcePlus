export const convertToReadableFormat = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B' // 1.1B
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + 'M' // 100M
  } else if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k' // 100k
  } else {
    return Number(value.toFixed(1)).toLocaleString('en-US', { minimumFractionDigits: 1 })
  }
}

export const formatCurrency = (value: number) => {
  // Check if the value has decimal places
  const hasDecimal = value % 1 !== 0

  // Use appropriate minimumFractionDigits based on whether there are decimals
  return value.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimal ? 1 : 0,
    maximumFractionDigits: hasDecimal ? 1 : 0,
  })
}
