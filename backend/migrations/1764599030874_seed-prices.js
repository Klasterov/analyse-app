/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO prices (service, year_month, price)
    VALUES 
      ('Gaze naturale', '2025-12', 3.5),
      ('Energie electrica', '2025-12', 1.2),
      ('Energie termica', '2025-12', 4.8),
      ('Apa si canalizare', '2025-12', 2.5)
    ON CONFLICT (service, year_month) DO NOTHING;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM prices WHERE year_month = '2025-12';
  `);
};
