// Formatting helpers shared by every page.
function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(new Date(dateValue));
}

function formatMoney(value) {
  return Number(value) === 0 ? 'Free' : new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD'
  }).format(value);
}

// The API returns date_state as 'past' or 'upcoming'; show it as a badge.
function renderEventStateBadge(event) {
  const state = event.date_state || 'upcoming';
  const badge = document.createElement('span');
  badge.className = `event-badge event-badge-${state}`;
  badge.textContent = state === 'past' ? 'Past' : 'Upcoming';
  return badge;
}
