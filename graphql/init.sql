-- GraphQL Users Schema
-- Run with: ./import.sh or bash import.sh

USE graphql;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  age INT NOT NULL,
  nationality VARCHAR(255) NOT NULL
);

-- Create address table
CREATE TABLE IF NOT EXISTS address (
  user_id INT PRIMARY KEY,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert mock data
INSERT INTO users (id, name, username, age, nationality) VALUES
  (1, 'John Doe', 'john_doe', 30, 'American'),
  (2, 'Jane Doe', 'jane_doe', 28, 'Canadian'),
  (3, 'Jim Doe', 'jim_doe', 35, 'British'),
  (4, 'Jill Doe', 'jill_doe', 32, 'Australian'),
  (5, 'Jack Doe', 'jack_doe', 27, 'New Zealander')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  username = VALUES(username),
  age = VALUES(age),
  nationality = VALUES(nationality);

-- Insert address data
INSERT INTO address (user_id, street, city, state, zip) VALUES
  (1, '123 Main St', 'Anytown', 'CA', '12345'),
  (2, '456 Main St', 'Anytown', 'CA', '12345'),
  (3, '789 Main St', 'Anytown', 'CA', '12345'),
  (4, '101 Main St', 'Anytown', 'CA', '12345'),
  (5, '123 Main St', 'Anytown', 'CA', '12345');