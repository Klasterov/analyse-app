exports.up = (pgm) => {
  // Добавляем показания для пользователя с id = 2
  pgm.sql(`
    UPDATE users 
    SET 
      last_gaze_reading = 1250.50,
      last_electricity_reading = 3420.75,
      last_heat_reading = 8900.00,
      last_water_reading = 456.25,
      last_reading_date = current_timestamp
    WHERE id = 2;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    UPDATE users 
    SET 
      last_gaze_reading = NULL,
      last_electricity_reading = NULL,
      last_heat_reading = NULL,
      last_water_reading = NULL,
      last_reading_date = NULL
    WHERE id = 2;
  `);
};
