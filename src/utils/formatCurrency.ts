/**
 * Formats a number as currency with specified locale and currency
 * @param amount - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
