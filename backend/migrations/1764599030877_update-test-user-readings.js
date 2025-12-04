exports.up = (pgm) => {
  // Находим первого пользователя и обновляем его показания
  pgm.sql(`
    UPDATE users 
    SET 
      last_gaze_reading = 1250.50,
      last_electricity_reading = 3420.75,
      last_heat_reading = 8900.00,
      last_water_reading = 456.25,
      last_reading_date = current_timestamp
    WHERE id IN (SELECT id FROM users ORDER BY id ASC LIMIT 1);
  `);
};

exports.down = (pgm) => {
  // Откатываем
  pgm.sql(`
    UPDATE users 
    SET 
      last_gaze_reading = NULL,
      last_electricity_reading = NULL,
      last_heat_reading = NULL,
      last_water_reading = NULL,
      last_reading_date = NULL
    WHERE id IN (SELECT id FROM users ORDER BY id ASC LIMIT 1);
  `);
};
