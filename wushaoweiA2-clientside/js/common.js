// shared helpers for the three pages
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// keep day and month numbers two digits long
function twoDigits(value) {
  return value < 10 ? '0' + value : '' + value;
}

function parseLocal(dateValue) {
  const bits = String(dateValue).split(/[- :T]/);
  return new Date(
    Number(bits[0]), Number(bits[1]) - 1, Number(bits[2]),
    Number(bits[3] || 0), Number(bits[4] || 0), Number(bits[5] || 0)
  );
}

function formatDate(dateValue) {
  const d = parseLocal(dateValue);
  let hour = d.getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' '
    + d.getFullYear() + ' at ' + hour + ':' + twoDigits(d.getMinutes()) + ' ' + ampm;
}

// Format money value
function formatMoney(value) {
  if (Number(value) === 0) return 'Free';
  const withCommas = Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas;
}

// mark the event as past or upcoming
function makeStatus(event) {
  const badge = document.createElement('span');
  const isPast = parseLocal(event.event_date) < new Date();
  badge.className = isPast ? 'badge badge-past' : 'badge badge-upcoming';
  badge.textContent = isPast ? 'Past' : 'Upcoming';
  return badge;
}
