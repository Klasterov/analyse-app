exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  pgm.createTable('meter_readings', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    month: { type: 'varchar(20)', notNull: true },
    previous_value: { type: 'numeric', notNull: true, default: 0 },
    current_value: { type: 'numeric', notNull: true },
    difference: { type: 'numeric', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  pgm.createIndex('meter_readings', ['user_id', 'month'], { unique: true });

  pgm.sql(`
    INSERT INTO users (name, email, password)
    VALUES ('Test User', 'test@example.com', 'password123');
  `);

  pgm.sql(`
    INSERT INTO meter_readings (user_id, month, previous_value, current_value, difference)
    VALUES (
      (SELECT id FROM users WHERE email = 'test@example.com'),
      '2025-09', 0, 100, 100
    );
  `);
};


exports.down = (pgm) => {
  pgm.dropTable('meter_readings');
  pgm.dropTable('users');
};
