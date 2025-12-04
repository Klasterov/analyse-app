/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO analysis_data (region, service, period, values, price)
    VALUES 
      ('Region 1', 'Gaze naturale', 'month', ARRAY[10, 12, 15, 11, 13, 14, 12, 16, 18, 20, 19, 17], 3.5),
      ('Region 1', 'Energie electrica', 'month', ARRAY[50, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80], 1.2),
      ('Region 1', 'Energie termica', 'month', ARRAY[100, 110, 120, 115, 125, 130, 140, 135, 145, 150, 160, 170], 4.8),
      ('Region 1', 'Apa si canalizare', 'month', ARRAY[20, 22, 25, 23, 26, 28, 30, 29, 32, 35, 38, 40], 2.5),
      ('Region 2', 'Gaze naturale', 'month', ARRAY[12, 14, 16, 13, 15, 17, 14, 18, 20, 22, 21, 19], 3.5),
      ('Region 2', 'Energie electrica', 'month', ARRAY[55, 60, 65, 63, 67, 70, 75, 73, 78, 82, 85, 88], 1.2),
      ('Region 2', 'Energie termica', 'month', ARRAY[110, 120, 130, 125, 135, 140, 150, 145, 155, 160, 170, 180], 4.8),
      ('Region 2', 'Apa si canalizare', 'month', ARRAY[22, 24, 27, 25, 28, 30, 32, 31, 34, 37, 40, 42], 2.5)
    ON CONFLICT DO NOTHING;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM analysis_data 
    WHERE period='month' AND (service IN ('Gaze naturale', 'Energie electrica', 'Energie termica', 'Apa si canalizare'));
  `);
};

