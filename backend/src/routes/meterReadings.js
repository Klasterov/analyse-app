const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /meter-readings/add:
 *   post:
 *     summary: Добавить показание счётчика для текущего пользователя
 *     tags: [Meter]
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
router.post('/add', authMiddleware, async (req, res) => {
  const { month, previous_value, current_value } = req.body;
  const userId = req.userId;

  if (!month || previous_value == null || current_value == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const difference = current_value - previous_value;

  try {
    const result = await pool.query(
      `INSERT INTO meter_readings (user_id, month, previous_value, current_value, difference)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, month, previous_value, current_value, difference]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding meter reading:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM meter_readings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching meter readings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
