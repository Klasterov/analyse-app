const express = require('express');
const router = express.Router();
const pricesController = require('../controllers/pricesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/current', pricesController.getCurrentMonthPrices);
router.get('/:yearMonth', pricesController.getPricesByMonth);
router.get('/', pricesController.getAllPrices);
router.post('/', authMiddleware, pricesController.setPrices);

module.exports = router;
