export const convertToReadableFormat = (value: number) => {
  const hasDecimal = value % 1 !== 0;

  if (value >= 1_000_000_000) {
    return (
      (value / 1_000_000_000).toLocaleString('en-US', {
        minimumFractionDigits: hasDecimal ? 1 : 0,
        maximumFractionDigits: hasDecimal ? 1 : 0,
      }) + 'B'
    );
  } else if (value >= 1_000_000) {
    return (
      (value / 1_000_000).toLocaleString('en-US', {
        minimumFractionDigits: hasDecimal ? 1 : 0,
        maximumFractionDigits: hasDecimal ? 1 : 0,
      }) + 'M'
    );
  } else if (value >= 1_000) {
    return (
      (value / 1_000).toLocaleString('en-US', {
        minimumFractionDigits: hasDecimal ? 1 : 0,
        maximumFractionDigits: hasDecimal ? 1 : 0,
      }) + 'k'
    );
  } else {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: hasDecimal ? 1 : 0,
      maximumFractionDigits: hasDecimal ? 1 : 0,
    });
  }
};

export const formatCurrency = (value: number) => {
  // Check if the value has decimal places
  const hasDecimal = value % 1 !== 0;

  // Use appropriate minimumFractionDigits based on whether there are decimals
  return value.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimal ? 1 : 0,
    maximumFractionDigits: hasDecimal ? 1 : 0,
  });
};
