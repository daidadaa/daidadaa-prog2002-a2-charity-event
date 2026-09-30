// event detail page
const eventMessage = document.querySelector('#event-message');
const detailContainer = document.querySelector('#event-detail');
const modal = document.querySelector('#register-modal');
const closeModalButton = document.querySelector('#close-modal');
const modalConfirmButton = document.querySelector('#modal-confirm');

// Close the modal
function closeModal() {
  modal.hidden = true;
}

// Open the modal
function openModal() {
  modal.hidden = false;
  closeModalButton.focus();
}

// Add text to the detail container
function addText(parent, tagName, text, className = '') {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.appendChild(element);
  return element;
}


// Show the event detail
function showDetail(event) {
  const image = document.createElement('img');
  image.className = 'detail-image';
  image.src = event.image_url || 'images/event-placeholder.jpg';
  image.alt = '';

  const body = document.createElement('div');
  body.className = 'detail-body';
  addText(body, 'p', event.category_name, 'eyebrow');
  addText(body, 'h1', event.name);
  addText(body, 'p', formatDate(event.event_date) + ' | ' + event.location, 'detail-meta');
  addText(body, 'p', event.purpose, 'lead');
  addText(body, 'p', event.description);

  const information = document.createElement('section');
  information.className = 'detail-information';
  addText(information, 'h2', 'Event information');
  addText(information, 'p', 'Hosted by ' + event.organisation_name);
  addText(information, 'p', 'Ticket: ' + formatMoney(event.ticket_price));
  body.appendChild(information);

  // progress bar
  const goal = Number(event.fundraising_goal);
  const percent = goal > 0 ? Math.min(100, Math.round((Number(event.amount_raised) / goal) * 100)) : 0;
  const progressSection = document.createElement('section');
  progressSection.className = 'progress-section';
  addText(progressSection, 'h2', 'Goal vs. progress');
  addText(progressSection, 'p', formatMoney(event.amount_raised) + ' raised of ' + formatMoney(event.fundraising_goal) + ' goal');
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  bar.setAttribute('aria-valuenow', String(percent));
  const fill = document.createElement('span');
  fill.style.width = percent + '%';
  bar.appendChild(fill);
  progressSection.appendChild(bar);
  addText(progressSection, 'p', percent + '% of goal reached', 'progress-label');
  body.appendChild(progressSection);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button';
  button.textContent = 'Register';
  button.addEventListener('click', openModal);
  body.appendChild(button);

  while (detailContainer.firstChild) {
    detailContainer.removeChild(detailContainer.firstChild);
  }
  detailContainer.appendChild(image);
  detailContainer.appendChild(body);
  detailContainer.hidden = false;
}


// Load the event detail
async function loadEvent() {
  const eventId = new URLSearchParams(window.location.search).get('id');
  if (!eventId) {
    eventMessage.textContent = 'No event was selected. Please return to the event search page.';
    eventMessage.classList.add('error');
    return;
  }
  try {
    const res = await fetch(API_BASE + '/api/events/' + encodeURIComponent(eventId));
    const event = await res.json();
    if (!res.ok) {
      eventMessage.textContent = event.error;
      eventMessage.classList.add('error');
      return;
    }
    eventMessage.hidden = true;
    showDetail(event);
  } catch (e) {
    eventMessage.textContent = 'Something went wrong, please try again.';
    eventMessage.classList.add('error');
  }
}

closeModalButton.addEventListener('click', closeModal);
modalConfirmButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

loadEvent();
