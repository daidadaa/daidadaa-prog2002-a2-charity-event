const searchForm = document.querySelector('#search-form');
const dateField = document.querySelector('#date');
const categorySelect = document.querySelector('#category');
const clearButton = document.querySelector('#clear-filters');
const searchMessage = document.querySelector('#search-message');
const resultsContainer = document.querySelector('#search-results');
const resultsCount = document.querySelector('#results-count');

// The Date field is a plain text input (not type="date") so the browser never shows a
// localised date format hint. It must therefore be checked before it is sent to the API.
function classifyDate(rawDate) {
  if (!rawDate) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) return 'format';
  const parsed = new Date(`${rawDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== rawDate) {
    return 'invalid';
  }
  return null;
}

function showSearchError(message) {
  searchMessage.textContent = message;
  searchMessage.classList.add('error');
  searchMessage.hidden = false;
}

async function loadCategories() {
  try {
    const categories = await api.get('/api/categories');
    for (const category of categories) {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.name;
      categorySelect.append(option);
    }
  } catch (error) {
    searchMessage.textContent = `Could not load categories: ${error.message}`;
    searchMessage.classList.add('error');
  }
}

async function searchEvents() {
  const problem = classifyDate(dateField.value.trim());
  if (problem) {
    resultsContainer.replaceChildren();
    resultsCount.textContent = '';
    showSearchError(problem === 'format'
      ? 'Please enter the date as YYYY-MM-DD.'
      : 'That date does not exist. Please check the day and month.');
    return;
  }

  const formData = new FormData(searchForm);
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (value.trim()) params.set(key, value.trim());
  }

  searchMessage.hidden = false;
  searchMessage.classList.remove('error');
  searchMessage.textContent = 'Searching for events...';
  resultsCount.textContent = '';
  resultsContainer.replaceChildren();
  try {
    const query = params.toString();
    const events = await api.get(`/api/events${query ? `?${query}` : ''}`);
    if (events.length === 0) {
      resultsCount.textContent = 'No matches';
      searchMessage.textContent = 'No active events match those filters. Try changing or clearing them.';
      return;
    }
    resultsCount.textContent = `${events.length} event${events.length === 1 ? '' : 's'} found`;
    searchMessage.textContent = 'Results are shown below.';
    renderEventCards(resultsContainer, events);
  } catch (error) {
    resultsCount.textContent = '';
    showSearchError(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchEvents();
});

clearButton.addEventListener('click', () => {
  searchForm.reset();
  resultsContainer.replaceChildren();
  resultsCount.textContent = '';
  searchMessage.hidden = false;
  searchMessage.classList.remove('error');
  searchMessage.textContent = 'Filters cleared. Choose filters and search again.';
});

loadCategories();
