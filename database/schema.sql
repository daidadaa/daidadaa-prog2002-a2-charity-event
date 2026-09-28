-- Schema for the charity events website.
-- Creates the database, its three tables and the indexes used by the site queries.
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

-- Secondary indexes: the home page, the search page and the detail page all
-- filter or order by these columns.
CREATE INDEX idx_events_status_date ON events (status, event_date);
CREATE INDEX idx_events_category ON events (category_id);
CREATE INDEX idx_events_location ON events (location);
