-- ── Aware — Seed Data ──────────────────────────────────────────────────────────
-- Generates 90 days of realistic fake readings for electricity, gas, and water.
-- Run schema.sql before this file.

USE aware_db;

-- Clear any existing data before seeding
DELETE FROM readings;

DROP PROCEDURE IF EXISTS GenerateSeedData;

DELIMITER //

CREATE PROCEDURE GenerateSeedData()
BEGIN
  DECLARE i          INT DEFAULT 0;
  DECLARE cur_date   DATE;
  DECLARE month_num  INT;
  DECLARE elec_val   DECIMAL(10,2);
  DECLARE gas_val    DECIMAL(10,2);
  DECLARE water_val  DECIMAL(10,2);

  WHILE i < 90 DO
    SET cur_date  = DATE_SUB(CURDATE(), INTERVAL i DAY);
    SET month_num = MONTH(cur_date);

    -- Electricity: 8–16 kWh/day; slightly elevated in winter
    SET elec_val = ROUND(
      8 + RAND() * 8 + IF(month_num IN (1, 2, 12), RAND() * 3, 0),
      2
    );

    -- Gas: much higher in winter (Jan–Mar, Dec): 6–14 m³
    --      low in summer (Apr–Oct): 1–4 m³
    SET gas_val = ROUND(
      IF(month_num IN (1, 2, 3, 12),
        6  + RAND() * 8,
        0.8 + RAND() * 3.2
      ),
      2
    );

    -- Water: 140–230 L/day, consistent throughout the year
    SET water_val = ROUND(140 + RAND() * 90, 2);

    INSERT INTO readings (date, utility_type, value, unit) VALUES
      (cur_date, 'electricity', elec_val,  'kWh'),
      (cur_date, 'gas',         gas_val,   'm³'),
      (cur_date, 'water',       water_val, 'L');

    SET i = i + 1;
  END WHILE;
END //

DELIMITER ;

CALL GenerateSeedData();
DROP PROCEDURE GenerateSeedData;

SELECT
  utility_type,
  COUNT(*)             AS records,
  ROUND(SUM(value), 2) AS total,
  ROUND(AVG(value), 2) AS daily_avg
FROM readings
GROUP BY utility_type;
