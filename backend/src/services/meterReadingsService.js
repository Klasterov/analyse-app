const db = require('../db');

class MeterReadingsService {
  // Создание показания — теперь userId передаём отдельно
  async create(userId, data) {
    const { month, previous_value, current_value } = data;
    const difference = current_value - previous_value;

    const result = await db.query(
      `INSERT INTO meter_readings (user_id, month, previous_value, current_value, difference)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, month, previous_value, current_value, difference]
    );

    return result.rows[0];
  }

  // Получение всех показаний пользователя
  async getAllByUser(userId) {
    const result = await db.query(
      'SELECT * FROM meter_readings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  // Обновление показания — можно проверять userId для безопасности
  async update(id, data) {
    const { month, previous_value, current_value } = data;
    const difference = current_value - previous_value;

    const result = await db.query(
      `UPDATE meter_readings 
       SET month=$1, previous_value=$2, current_value=$3, difference=$4
       WHERE id=$5 RETURNING *`,
      [month, previous_value, current_value, difference, id]
    );

    return result.rows[0];
  }

  // Удаление показания
  async delete(id) {
    const result = await db.query('DELETE FROM meter_readings WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new MeterReadingsService();
