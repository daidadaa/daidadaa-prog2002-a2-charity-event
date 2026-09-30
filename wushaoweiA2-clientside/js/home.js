// home page
const homeMessage = document.querySelector('#home-message');
const eventList = document.querySelector('#event-list');

// make one event card
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
  while (eventList.firstChild) {
    eventList.removeChild(eventList.firstChild);
  }
  for (const event of events) {
    eventList.appendChild(makeCard(event));
  }
}


// Load the home events
async function loadHomeEvents() {
  try {
    const res = await fetch(API_BASE + '/api/events/home');
    const events = await res.json();
    if (!res.ok) {
      homeMessage.hidden = false;
      homeMessage.textContent = events.error;
      homeMessage.classList.add('error');
      return;
    }
    if (events.length === 0) {
      homeMessage.textContent = 'There are no upcoming events at the moment. Please check back soon.';
      return;
    }
    homeMessage.hidden = true;
    showEvents(events);
  } catch (e) {
    // if the request fails the loading message must not stay hidden
    homeMessage.hidden = false;
    homeMessage.textContent = 'Unable to load the events. Please try again later.';
    homeMessage.classList.add('error');
  }
}

loadHomeEvents();
