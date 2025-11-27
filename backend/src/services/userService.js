const pool = require('../db');
const bcrypt = require('bcryptjs');

/**
 * Создание нового пользователя
 * @param {string} name - Имя пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 */
const createUser = async (name, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Ошибка в createUser:', error);
    throw new Error('Ошибка при создании пользователя');
  }
};

/**
 * Поиск пользователя по email
 * @param {string} email - Email пользователя
 */
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null; // Если пользователь не найден, вернем null
  } catch (error) {
    console.error('Ошибка в findUserByEmail:', error);
    throw new Error('Ошибка при поиске пользователя по email');
  }
};

/**
 * Поиск пользователя по ID
 * @param {number} id - ID пользователя
 */
const findUserById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null; // Если пользователь не найден, вернем null
  } catch (error) {
    console.error('Ошибка в findUserById:', error);
    throw new Error('Ошибка при поиске пользователя по ID');
  }
};

/**
 * Обновление пользователя
 * @param {number} id - ID пользователя
 * @param {object} data - Данные для обновления
 */
const updateUser = async (id, data) => {
  const fields = [];
  const values = [id];

  if (data.name) {
    fields.push(`name = $${values.length + 1}`);
    values.push(data.name);
  }
  if (data.email) {
    fields.push(`email = $${values.length + 1}`);
    values.push(data.email);
  }

  // Проверка, если нет данных для обновления
  if (fields.length === 0) {
    throw new Error('Нет данных для обновления');
  }

  try {
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING id, name, email`;

    const result = await pool.query(query, values);
    return result.rows[0]; // Возвращаем обновленного пользователя
  } catch (error) {
    console.error('Ошибка в updateUser:', error);
    throw new Error('Ошибка при обновлении пользователя');
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
