const meterReadingsService = require('../services/meterReadingsService');

/**
 * @swagger
 * /meter-readings/add:
 *   post:
 *     summary: Добавить показание счётчика для текущего пользователя
 *     tags: [Meter Readings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: "2025-10"
 *               previous_value:
 *                 type: number
 *                 example: 100
 *               current_value:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Показание успешно добавлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 month:
 *                   type: string
 *                 previous_value:
 *                   type: number
 *                 current_value:
 *                   type: number
 *                 difference:
 *                   type: number
 *                 created_at:
 *                   type: string
 */
exports.createMeterReading = async (req, res) => {
  const { month, previous_value, current_value } = req.body;
  const userId = req.userId; 

  if (!month || previous_value == null || current_value == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const difference = current_value - previous_value;

  try {
    const meterReading = await meterReadingsService.create({
      user_id: userId,
      month,
      previous_value,
      current_value,
      difference
    });

    res.status(201).json(meterReading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании показания' });
  }
};

/**
 * @swagger
 * /meter-readings/my:
 *   get:
 *     summary: Получить все показания текущего пользователя
 *     tags: [Meter Readings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список показаний пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   month:
 *                     type: string
 *                   previous_value:
 *                     type: number
 *                   current_value:
 *                     type: number
 *                   difference:
 *                     type: number
 *                   created_at:
 *                     type: string
 */
exports.getMyMeterReadings = async (req, res) => {
  const userId = req.userId;

  try {
    const meterReadings = await meterReadingsService.getByUserId(userId);
    res.json(meterReadings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении показаний' });
  }
};
