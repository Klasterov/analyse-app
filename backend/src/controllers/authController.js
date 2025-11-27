const authService = require('../services/authService');
const userService = require('../services/userService');

/**
 * Регистрация нового пользователя
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя в системе.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Неверный запрос
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
  }

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }
    const hashedPassword = await authService.hashPassword(password);
    
    const newUser = await userService.createUser(name, email, hashedPassword);

    return res.status(201).json({
      message: 'Пользователь успешно зарегистрирован.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return res.status(500).json({ message: 'Ошибка при регистрации.' });
  }
};

/**
 * Логин пользователя
 * @swagger
 * /login:
 *   post:
 *     summary: Логин пользователя
 *     description: Вход в систему с использованием email и пароля.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный логин и получение токена
 *       401:
 *         description: Неверный email или пароль
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны для входа.' });
  }

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль.' });
    }
    const isPasswordValid = await authService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль.' });
    }

    const token = authService.generateToken(user.id);
    return res.status(200).json({ message: 'Успешный логин.', token });
  } catch (error) {
    console.error('Ошибка при логине:', error);
    return res.status(500).json({ message: 'Ошибка при логине.' });
  }
};

/**
 * Получение профиля пользователя
 * @swagger
 * /profile:
 *   get:
 *     summary: Получить профиль пользователя
 *     description: Получение данных текущего пользователя.
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *       401:
 *         description: Пользователь не авторизован
 */
const getProfile = async (req, res) => {
  const userId = req.userId; 
  try {
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return res.status(500).json({ message: 'Ошибка при получении профиля.' });
  }
};

/**
 * Обновление данных пользователя
 * @swagger
 * /auth/update/{id}:
 *   put:
 *     summary: Обновление информации о пользователе
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя, которого нужно обновить
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Данные пользователя обновлены
 *       400:
 *         description: Ошибка валидации или пользователь не найден
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({ message: 'Для обновления необходимо передать хотя бы одно поле.' });
  }

  try {
    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    const fieldsToUpdate = [];
    const values = [];

    if (name) {
      fieldsToUpdate.push('name = $' + (fieldsToUpdate.length + 1));
      values.push(name);
    }

    if (email) {
      fieldsToUpdate.push('email = $' + (fieldsToUpdate.length + 1));
      values.push(email);
    }

    if (password) {
      const hashedPassword = await authService.hashPassword(password);
      fieldsToUpdate.push('password = $' + (fieldsToUpdate.length + 1));
      values.push(hashedPassword);
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, name, email;
    `;

    const result = await userService.updateUser(query, values);
    return res.status(200).json({
      message: 'Данные пользователя успешно обновлены.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    return res.status(500).json({ message: 'Ошибка при обновлении данных пользователя.' });
  }
};

/**
 * Удаление пользователя
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя, которого нужно удалить
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пользователь удален
 *       404:
 *         description: Пользователь не найден
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUser(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Пользователь успешно удален.' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return res.status(500).json({ message: 'Ошибка при удалении пользователя.' });
  }
};

module.exports = { register, login, getProfile, updateUser, deleteUser };
