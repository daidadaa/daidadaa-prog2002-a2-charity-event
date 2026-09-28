// Builds the event card used on the home page and on the search results.
function createEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';

  const image = document.createElement('img');
  image.className = 'event-card-image';
  image.src = event.image_url || '/images/event-placeholder.jpg';
  image.alt = '';
  image.loading = 'lazy';

  const content = document.createElement('div');
  content.className = 'event-card-content';
  const metadata = document.createElement('p');
  metadata.className = 'event-meta';
  metadata.textContent = `${event.category_name} | ${formatDate(event.event_date)}`;
  metadata.append(renderEventStateBadge(event));
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
  link.href = `detail.html?id=${encodeURIComponent(event.event_id)}`;
  link.textContent = 'View details';
  footer.append(price, link);
  content.append(metadata, title, location, footer);
  card.append(image, content);
  return card;
}

function renderEventCards(container, events) {
  container.replaceChildren(...events.map(createEventCard));
}
