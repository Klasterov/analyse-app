/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('prices', {
    id: 'id',
    service: { type: 'varchar(100)', notNull: true },
    year_month: { type: 'varchar(7)', notNull: true }, // format: YYYY-MM
    price: { type: 'numeric(10,2)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  pgm.createIndex('prices', ['service', 'year_month'], { unique: true });

  // Insert initial prices for current month (December 2025)
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
  pgm.dropTable('prices');
};
