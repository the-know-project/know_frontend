/**
 * Formats numbers to display with k suffix for values over 999
 * @param value - The number to format
 * @returns Formatted string with k suffix if applicable
 */
export const formatViewCount = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace('.0', '') + 'M';
  }

  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace('.0', '') + 'k';
  }

  return numValue.toString();
};

/**
 * Generic number formatter with customizable suffixes
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export const formatNumber = (
  value: string | number,
  options: {
    thousands?: string;
    millions?: string;
    billions?: string;
    precision?: number;
  } = {}
): string => {
  const {
    thousands = 'k',
    millions = 'M',
    billions = 'B',
    precision = 1,
  } = options;

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(precision).replace('.0', '') + billions;
  }

  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(precision).replace('.0', '') + millions;
  }

  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(precision).replace('.0', '') + thousands;
  }

  return numValue.toString();
};
