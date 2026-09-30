-- PROG2002 Assessment 2 database
-- import this file in MySQL Workbench first

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

CREATE TABLE organisations (
  organisation_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mission TEXT NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  website VARCHAR(255)
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255)
);

-- main table
CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  organisation_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  event_date DATETIME NOT NULL,
  location VARCHAR(160) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  fundraising_goal DECIMAL(12, 2) NOT NULL,
  amount_raised DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_organisation FOREIGN KEY (organisation_id)
    REFERENCES organisations(organisation_id),
  CONSTRAINT fk_events_category FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
);

INSERT INTO organisations (name, mission, email, phone, website) VALUES
('Kind', 'We bring neighbours together to fund practical support and brighter futures.', 'hello@kind.org', '(02) 6600 2000', 'https://kind.org');

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Community runs and walks for a cause.'),
('Gala Dinner', 'Formal evenings celebrating generosity.'),
('Auction', 'Fundraising auctions and creative showcases.'),
('Concert', 'Live music events supporting local programs.');

-- 8 events, the dates are based on CURDATE() so they are always upcoming
INSERT INTO events (organisation_id, category_id, name, event_date, location, purpose, description, ticket_price, fundraising_goal, amount_raised, status, image_url) VALUES
(1, 1, 'Coastal Sunrise Fun Run', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 13 DAY), '06:30:00'), 'Lismore Riverside Park', 'Fund youth mental health outreach.', 'Choose a 5 km or 10 km riverside course and help local young people access timely mental health support.', 25.00, 18000.00, 7450.00, 'active', 'images/coastal-sunrise-fun-run.jpg'),
(1, 2, 'Light the Way Gala', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 26 DAY), '18:30:00'), 'Ballina Heritage Hall', 'Fund safe accommodation for families.', 'An evening of shared stories, a three-course dinner and a quiet auction in support of emergency family accommodation.', 120.00, 35000.00, 18400.00, 'active', 'images/light-the-way-gala.jpg'),
(1, 3, 'Art for Tomorrow Auction', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 40 DAY), '17:00:00'), 'Byron Arts Precinct', 'Fund creative learning resources.', 'Bid on work donated by local artists and help equip community learning spaces with materials and mentoring.', 0.00, 12000.00, 5100.00, 'active', 'images/art-for-tomorrow-auction.jpg'),
(1, 4, 'Songs for Shelter', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 54 DAY), '19:00:00'), 'Tweed Civic Theatre', 'Fund warm meals and essential supplies.', 'A night of live music featuring regional performers, with every ticket supporting the Shelter Table program.', 45.00, 22000.00, 9800.00, 'active', 'images/songs-for-shelter.jpg'),
(1, 1, 'Steps for Safe Water', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 69 DAY), '08:00:00'), 'Kingscliff Foreshore', 'Fund clean water equipment.', 'Walk, run or cheer from the sidelines while raising funds for portable clean water systems.', 15.00, 15000.00, 2250.00, 'active', 'images/steps-for-safe-water.jpg'),
(1, 2, 'Community Table Dinner', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 81 DAY), '18:00:00'), 'Murwillumbah Community Centre', 'Fund food relief during summer.', 'A welcoming shared dinner that turns each place at the table into a week of groceries for a neighbour.', 65.00, 10000.00, 3400.00, 'active', 'images/community-table-dinner.jpg'),
(1, 3, 'Winter Makers Auction', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 78 DAY), '16:00:00'), 'Lismore Makers Hall', 'Fund repair workshops.', 'A completed winter auction that helped support practical repair skills and tools for local residents.', 0.00, 9000.00, 9000.00, 'active', 'images/winter-makers-auction.jpg'),
(1, 4, 'Harbour Voices Concert', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '18:30:00'), 'Ballina Wharf Stage', 'Fund inclusive arts programs.', 'This event is temporarily unavailable while its program is reviewed.', 35.00, 16000.00, 1200.00, 'suspended', 'images/harbour-voices-concert.jpg');
