// search page
const searchForm = document.querySelector('#search-form');
const categorySelect = document.querySelector('#category');
const dateSelect = document.querySelector('#date');
const locationInput = document.querySelector('#location');
const clearButton = document.querySelector('#clear-filters');
const searchMessage = document.querySelector('#search-message');
const resultsContainer = document.querySelector('#search-results');

// same card code as the home page, keep it here so the two pages do not depend on each other
function makeCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';
  const image = document.createElement('img');
  image.className = 'event-card-image';
  image.src = event.image_url || 'images/event-placeholder.jpg';
  image.alt = '';
  const content = document.createElement('div');
  content.className = 'event-card-content';
  const metadata = document.createElement('p');
  metadata.className = 'event-meta';
  const metaText = document.createElement('span');
  metaText.textContent = event.category_name + ' | ' + formatDate(event.event_date);
  metadata.appendChild(makeStatus(event));
  metadata.appendChild(metaText);
  const title = document.createElement('h3');
  title.textContent = event.name;
  const location = document.createElement('p');
  location.textContent = event.location;
  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const price = document.createElement('span');
  price.textContent = formatMoney(event.ticket_price);
  const link = document.createElement('a');
  link.className = 'text-link';
  link.href = 'event.html?id=' + event.event_id;
  link.textContent = 'View details';
  footer.appendChild(price);
  footer.appendChild(link);
  content.appendChild(metadata);
  content.appendChild(title);
  content.appendChild(location);
  content.appendChild(footer);
  card.appendChild(image);
  card.appendChild(content);
  return card;
}


// Show the events
function showEvents(events) {
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
  for (const event of events) {
    resultsContainer.appendChild(makeCard(event));
  }
}


function checkDate(dateValue) {
  const d = parseLocal(dateValue);
  return d.getFullYear() + '-' + twoDigits(d.getMonth() + 1) + '-' + twoDigits(d.getDate());
}

// Load the categories
async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    const categories = await res.json();
    for (const category of categories) {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    }
  } catch (e) {
    searchMessage.textContent = 'Could not load the categories.';
    searchMessage.classList.add('error');
  }
}

// Load the dates
async function loadDates() {
  try {
    const res = await fetch('/api/events');
    const events = await res.json();
    const dateKeys = [];
    for (const event of events) {
      const key = checkDate(event.event_date);
      if (dateKeys.indexOf(key) === -1) {
        dateKeys.push(key);
      }
    }
    dateKeys.sort();
    for (const dateKey of dateKeys) {
      const option = document.createElement('option');
      option.value = dateKey;
      const d = new Date(dateKey + 'T00:00:00');
      option.textContent = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
      dateSelect.appendChild(option);
    }
  } catch (e) {
    searchMessage.textContent = 'Could not load the dates.';
    searchMessage.classList.add('error');
  }
}

// Search the events
async function searchEvents() {
  const place = locationInput.value.trim();
  const parts = [];
  if (dateSelect.value) parts.push('date=' + encodeURIComponent(dateSelect.value));
  if (place) parts.push('location=' + encodeURIComponent(place));
  if (categorySelect.value) parts.push('category=' + encodeURIComponent(categorySelect.value));
  const query = parts.length > 0 ? '?' + parts.join('&') : '';
  searchMessage.classList.remove('error');
  searchMessage.textContent = 'Searching for events...';
  showEvents([]);
  try {
    const res = await fetch('/api/events' + query);
    const events = await res.json();
    if (!res.ok) {
      searchMessage.textContent = events.error;
      searchMessage.classList.add('error');
      return;
    }
    if (events.length === 0) {
      searchMessage.textContent = 'No active events match those filters. Try changing or clearing them.';
      return;
    }
    const word = events.length === 1 ? ' event' : ' events';
    searchMessage.textContent = events.length + word + ' found.';
    showEvents(events);
  } catch (e) {
    searchMessage.textContent = 'The search did not work, please try again.';
    searchMessage.classList.add('error');
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const place = locationInput.value.trim();
  if (place.length > 0 && place.length < 2) {
    showEvents([]);
    searchMessage.textContent = 'Please type at least 2 letters for the location.';
    searchMessage.classList.add('error');
    return;
  }
  searchEvents();
});

clearButton.addEventListener('click', () => {
  searchForm.reset();
  showEvents([]);
  searchMessage.classList.remove('error');
  searchMessage.textContent = 'Filters cleared. Choose filters and search again.';
});

// load the dates again after a new event is added
loadCategories();
loadDates();
