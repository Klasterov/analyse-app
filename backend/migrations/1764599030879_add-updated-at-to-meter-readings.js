exports.up = (pgm) => {
  pgm.addColumns('meter_readings', {
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('meter_readings', ['updated_at']);
};
