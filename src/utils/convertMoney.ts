export const convertToReadableFormat = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B'
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k'
  } else {
    return Number(value.toFixed(1)).toLocaleString('en-US', { minimumFractionDigits: 1 })
  }
}

export const formatCurrency = (value: number) => {
  return Number(value.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })
}
