const homeMessage = document.querySelector('#home-message');
const eventList = document.querySelector('#event-list');

async function loadHomeEvents() {
  try {
    const events = await api.get('/api/events/home');
    if (events.length === 0) {
      homeMessage.textContent = 'There are no upcoming events at the moment. Please check back soon.';
      return;
    }
    homeMessage.hidden = true;
    renderEventCards(eventList, events);
  } catch (error) {
    homeMessage.textContent = error.message;
    homeMessage.classList.add('error');
  }
}

loadHomeEvents();
