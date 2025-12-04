const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const analysisController = require('../controllers/analysisController');

router.post('/', authMiddleware, analysisController.addData);
router.get('/:region/:service', analysisController.getData);
router.get('/latest-month/:region/:service', analysisController.getLatestMonthData);
router.delete('/:id', authMiddleware, analysisController.deleteData);
router.get('/regions', analysisController.getRegions);
router.get('/services', analysisController.getServices);


module.exports = router;