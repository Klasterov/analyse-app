const pool = require('../src/db');
const bcrypt = require('bcryptjs'); // для хэширования пароля

const updateUser = async (id, data) => {
  const fields = [];
  const values = [id];

  // Проверка на наличие email в данных для обновления
  if (data.email) {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 AND id != $2', [data.email, id]);
    if (existingUser.rows.length > 0) {
      throw new Error('Этот email уже занят другим пользователем');
    }
    fields.push(`email = $${values.length + 1}`);
    values.push(data.email);
  }

  // Если был передан новый пароль, его нужно хэшировать
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10); // хэширование пароля
    fields.push(`password = $${values.length + 1}`);
    values.push(hashedPassword);
  }

  if (data.name) {
    fields.push(`name = $${values.length + 1}`);
    values.push(data.name);
  }

  if (fields.length === 0) {
    throw new Error('Нет данных для обновления');
  }

  // Формируем запрос для обновления
  const query = `
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE id = $1 
    RETURNING id, name, email
  `;

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Ошибка при обновлении пользователя:', err);
    throw new Error('Ошибка при обновлении пользователя');
  }
};

module.exports = { updateUser };
