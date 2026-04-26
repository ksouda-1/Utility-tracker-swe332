-- ── Aware — Database Schema ────────────────────────────────────────────────────
-- Run this file first, then seed.sql

CREATE DATABASE IF NOT EXISTS aware_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aware_db;

CREATE TABLE IF NOT EXISTS readings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  date         DATE    NOT NULL,
  utility_type ENUM('electricity', 'gas', 'water') NOT NULL,
  value        DECIMAL(10, 2) NOT NULL,
  unit         VARCHAR(20)    NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date         (date),
  INDEX idx_utility_type (utility_type)
);
