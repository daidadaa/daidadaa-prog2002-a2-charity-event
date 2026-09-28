/**
 * Validates the query parameters used by the event search.
 * Each function returns { value } when the input is acceptable, or
 * { error } with a message that can be sent straight to the client.
 * An empty value means "this filter was not supplied".
 */

function parseDateValue(rawDate) {
  if (rawDate === undefined || rawDate === '') return { value: null };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return { error: 'Date must use the YYYY-MM-DD format.' };
  }
  const parsed = new Date(`${rawDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== rawDate) {
    return { error: 'Date must be a real calendar date.' };
  }
  return { value: rawDate };
}

function parseLocationValue(rawLocation) {
  if (rawLocation === undefined || rawLocation === '') return { value: null };
  if (rawLocation.length > 160) {
    return { error: 'Location must be 160 characters or fewer.' };
  }
  const cleaned = rawLocation.trim().replace(/\s+/g, ' ');
  if (!cleaned) return { error: 'Location must not be empty.' };
  return { value: cleaned };
}

function parseCategoryValue(rawCategory) {
  if (rawCategory === undefined || rawCategory === '') return { value: null };
  const categoryId = Number.parseInt(rawCategory, 10);
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return { error: 'Category must be a positive whole number.' };
  }
  return { value: categoryId };
}

module.exports = { parseDateValue, parseLocationValue, parseCategoryValue };
