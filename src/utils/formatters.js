export const formatLargeNumber = (number, currency) => {
  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;

  switch (true) {
    case number >= trillion:
      return `${(number / trillion).toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })} T`;
    case number >= billion:
      return `${(number / billion).toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })} B`;
    case number >= million:
      return `${(number / million).toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })} M`;
    default:
      return number.toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      });
  }
};