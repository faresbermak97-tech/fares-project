/**
 * Formats the current time with a specified timezone and locale
 * @param timezone - Timezone string (default: system timezone)
 * @param locale - Locale string (default: system locale)
 * @returns Formatted time string
 */
export function formatTime(timezone?: string, locale?: string): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  return now.toLocaleTimeString(locale || undefined, options);
}

/**
 * Formats a date string to a more readable format
 * @param dateString - ISO date string
 * @param locale - Locale string (default: system locale)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale || undefined, options);
}

/**
 * Formats a date and time string to a more readable format
 * @param dateString - ISO date string
 * @param locale - Locale string (default: system locale)
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleDateString(locale || undefined, options);
}

/**
 * Truncates text to a specified maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the text
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
