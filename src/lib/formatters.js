/**
 * Format a number as a currency string (USD)
 * @param {number} amount - Amount in currency units (e.g. dollars)
 * @returns {string} - Formatted currency string
 */
export function formatMoney(amount) {
  if (amount === undefined || amount === null) return "$0.00";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a date object or string into a readable date string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string (e.g. "Oct 4, 2023")
 */
export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(d);
}

export function formatPercentage(value) {
  if (value === undefined || value === null) return "0%";
  return Math.round(value * 100) + "%";
}
