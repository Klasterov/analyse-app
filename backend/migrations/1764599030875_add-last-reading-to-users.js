exports.up = (pgm) => {
  // Добавляем полі для хранения последних показаний по услугам
  pgm.addColumns('users', {
    last_gaze_reading: { type: 'numeric', default: null },
    last_electricity_reading: { type: 'numeric', default: null },
    last_heat_reading: { type: 'numeric', default: null },
    last_water_reading: { type: 'numeric', default: null },
    last_reading_date: { type: 'timestamp', default: null },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', [
    'last_gaze_reading',
    'last_electricity_reading',
    'last_heat_reading',
    'last_water_reading',
    'last_reading_date',
  ]);
};
