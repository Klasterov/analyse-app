exports.up = (pgm) => {
  // Добавляем примеры последних показаний для всех пользователей в таблице
  // Если у пользователя нет показаний, устанавливаем тестовые значения
  pgm.sql(`
    UPDATE users 
    SET 
      last_gaze_reading = COALESCE(last_gaze_reading, 1250.50),
      last_electricity_reading = COALESCE(last_electricity_reading, 3420.75),
      last_heat_reading = COALESCE(last_heat_reading, 8900.00),
      last_water_reading = COALESCE(last_water_reading, 456.25),
      last_reading_date = COALESCE(last_reading_date, current_timestamp)
    WHERE last_gaze_reading IS NULL;
  `);
};

exports.down = (pgm) => {
  // Откатываем - но оставляем данные, так как это может быть реальные данные пользователей
  // Просто логируем, что откатываем
  pgm.sql(`
    -- Откат миграции сида - данные остаются в БД
  `);
};
