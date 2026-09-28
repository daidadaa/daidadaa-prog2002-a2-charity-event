// Shared SQL fragments so every event route selects and joins the same columns.
const eventFields = `
  e.event_id, e.name, e.event_date, e.location, e.purpose, e.description,
  e.ticket_price, e.fundraising_goal, e.amount_raised, e.status, e.image_url,
  c.category_id, c.name AS category_name,
  o.organisation_id, o.name AS organisation_name, o.mission AS organisation_mission,
  o.email AS organisation_email, o.phone AS organisation_phone,
  CASE WHEN e.event_date >= CURDATE() THEN 'upcoming' ELSE 'past' END AS date_state`;

const eventJoins = `
  FROM events e
  INNER JOIN categories c ON e.category_id = c.category_id
  INNER JOIN organisations o ON e.organisation_id = o.organisation_id`;

module.exports = { eventFields, eventJoins };
