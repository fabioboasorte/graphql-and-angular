-- Migration: Add phone column to users table
-- Run this if you have an existing database created before phone was added.
-- Usage: mysql -u admin -pnimda graphql < migrations/add-phone.sql

ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL;
