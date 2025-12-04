const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const readingsController = require('../controllers/readingsController');

router.get('/last', authMiddleware, readingsController.getLastReadings);
router.post('/save', authMiddleware, readingsController.saveReadings);
router.get('/history', authMiddleware, readingsController.getReadingsHistory);
router.delete('/clear', authMiddleware, readingsController.clearLastReadings);

module.exports = router;
