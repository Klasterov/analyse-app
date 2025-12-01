/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('analysis_data', {
    id: 'id',
    region: { type: 'varchar(50)', notNull: true },
    service: { type: 'varchar(100)', notNull: true },
    period: { type: 'varchar(20)', notNull: true }, // week, month, year, future
    values: { type: 'integer[]', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('analysis_data');
};