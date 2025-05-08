export const convertToReadableFormat = (value: number): string => {
  const format = (num: number, suffix: string, forceDecimal = false) => {
    const hasDecimal = forceDecimal || num % 1 !== 0;
    return (
      num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: hasDecimal ? 2 : 0,
      }) + suffix
    );
  };
  if (value >= 1_000_000_000) {
    return format(value / 1_000_000_000, 'B');
  } else if (value >= 1_000_000) {
    return format(value / 1_000_000, 'M');
  } else if (value >= 100_000) {
    return format(value / 1_000, 'K');
  } else if (value >= 1_000) {
    return format(value / 1_000, 'k', true);
  } else {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: value % 1 !== 0 ? 2 : 0,
    });
  }
};

export const formatCurrency = (value: number) => {
  const hasDecimal = value % 1 !== 0;

  return value.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimal ? 1 : 0,
    maximumFractionDigits: hasDecimal ? 1 : 0,
  });
};
