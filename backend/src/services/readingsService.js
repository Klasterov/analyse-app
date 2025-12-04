const pool = require('../db');

const readingsService = {
  async getLastReadings(userId) {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          last_gaze_reading,
          last_electricity_reading,
          last_heat_reading,
          last_water_reading,
          last_reading_date
        FROM users 
        WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        userId: user.id,
        readings: {
          'Gaze naturale': user.last_gaze_reading,
          'Energie electrica': user.last_electricity_reading,
          'Energie termica': user.last_heat_reading,
          'Apa si canalizare': user.last_water_reading,
        },
        lastReadingDate: user.last_reading_date,
      };
    } catch (error) {
      console.error('Error getting last readings:', error);
      throw error;
    }
  },
  async saveReadings(userId, readings) {
    try {
      const now = new Date();

      // Build dynamic update to only set columns provided in `readings`
      const mapping = {
        'Gaze naturale': 'last_gaze_reading',
        'Energie electrica': 'last_electricity_reading',
        'Energie termica': 'last_heat_reading',
        'Apa si canalizare': 'last_water_reading',
      };

      const sets = [];
      const values = [];
      let idx = 1;

      for (const [key, col] of Object.entries(mapping)) {
        if (Object.prototype.hasOwnProperty.call(readings, key) && readings[key] !== null && readings[key] !== undefined) {
          sets.push(`${col} = $${idx}`);
          values.push(readings[key]);
          idx++;
        }
      }

      // Always update last_reading_date when at least one reading changed
      if (sets.length === 0) {
        throw new Error('No readings provided to update');
      }

      sets.push(`last_reading_date = $${idx}`);
      values.push(now);
      idx++;

      // add WHERE id
      values.push(userId);

      const sql = `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, last_gaze_reading, last_electricity_reading, last_heat_reading, last_water_reading, last_reading_date`;

      const result = await pool.query(sql, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return {
        userId: user.id,
        readings: {
          'Gaze naturale': user.last_gaze_reading,
          'Energie electrica': user.last_electricity_reading,
          'Energie termica': user.last_heat_reading,
          'Apa si canalizare': user.last_water_reading,
        },
        lastReadingDate: user.last_reading_date,
      };
    } catch (error) {
      console.error('Error saving readings:', error);
      throw error;
    }
  },
  async getReadingsHistory(userId, limit = 12) {
    try {
      const result = await pool.query(
        `SELECT 
          month,
          previous_value as previous,
          current_value as current,
          difference,
          created_at
        FROM meter_readings 
        WHERE user_id = $1 
        ORDER BY month DESC 
        LIMIT $2`,
        [userId, limit]
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting readings history:', error);
      throw error;
    }
  },
  async clearLastReadings(userId) {
    try {
      const result = await pool.query(
        `UPDATE users 
        SET 
          last_gaze_reading = NULL,
          last_electricity_reading = NULL,
          last_heat_reading = NULL,
          last_water_reading = NULL,
          last_reading_date = NULL
        WHERE id = $1
        RETURNING id`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return { success: true, userId };
    } catch (error) {
      console.error('Error clearing readings:', error);
      throw error;
    }
  },
};

module.exports = readingsService;
