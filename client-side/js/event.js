const eventMessage = document.querySelector('#event-message');
const detailContainer = document.querySelector('#event-detail');
const modal = document.querySelector('#register-modal');
const closeModalButton = document.querySelector('#close-modal');
const modalConfirmButton = document.querySelector('#modal-confirm');

function closeModal() {
  modal.hidden = true;
}

function openModal() {
  modal.hidden = false;
  closeModalButton.focus();
}

function addDetailElement(parent, tagName, text, className = '') {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function renderEventDetail(event) {
  const image = document.createElement('img');
  image.className = 'detail-image';
  image.src = event.image_url;
  image.alt = '';

  const body = document.createElement('div');
  body.className = 'detail-body';
  addDetailElement(body, 'p', event.category_name, 'eyebrow');
  addDetailElement(body, 'h1', event.name);
  addDetailElement(body, 'p', `${formatDate(event.event_date)} | ${event.location}`, 'detail-meta');
  addDetailElement(body, 'p', event.purpose, 'lead');
  addDetailElement(body, 'p', event.description);

  const information = document.createElement('section');
  information.className = 'detail-information';
  addDetailElement(information, 'h2', 'Event information');
  addDetailElement(information, 'p', `Hosted by ${event.organisation_name}`);
  addDetailElement(information, 'p', `Ticket: ${formatMoney(event.ticket_price)}`);
  body.append(information);

  const progress = Math.min(100, Math.round((Number(event.amount_raised) / Number(event.fundraising_goal)) * 100));
  const progressSection = document.createElement('section');
  progressSection.className = 'progress-section';
  addDetailElement(progressSection, 'h2', 'Goal vs. progress');
  addDetailElement(progressSection, 'p', `${formatMoney(event.amount_raised)} raised of ${formatMoney(event.fundraising_goal)} goal`);
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  progressBar.setAttribute('aria-valuenow', String(progress));
  const progressFill = document.createElement('span');
  progressFill.style.width = `${progress}%`;
  progressBar.append(progressFill);
  progressSection.append(progressBar);
  addDetailElement(progressSection, 'p', `${progress}% of goal reached`, 'progress-label');
  body.append(progressSection);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button';
  button.textContent = 'Register';
  button.addEventListener('click', openModal);
  body.append(button);

  detailContainer.replaceChildren(image, body);
  detailContainer.hidden = false;
}

async function loadEvent() {
  const eventId = new URLSearchParams(window.location.search).get('id');
  if (!eventId) {
    eventMessage.textContent = 'No event was selected. Please return to the event search page.';
    eventMessage.classList.add('error');
    return;
  }
  try {
    const event = await api.get(`/api/events/${encodeURIComponent(eventId)}`);
    eventMessage.hidden = true;
    renderEventDetail(event);
  } catch (error) {
    eventMessage.textContent = error.message;
    eventMessage.classList.add('error');
  }
}

closeModalButton.addEventListener('click', closeModal);
modalConfirmButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

loadEvent();
