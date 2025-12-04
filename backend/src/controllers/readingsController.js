const readingsService = require('../services/readingsService');

const readingsController = {
  async getLastReadings(req, res) {
    try {
      const userId = req.user?.id;
      console.log('getLastReadings called with userId:', userId);

      if (!userId) {
        console.error('No userId found in request');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const readings = await readingsService.getLastReadings(userId);
      console.log('Fetched readings:', readings);

      if (!readings) {
        console.log('No readings found for user:', userId);
        return res.status(404).json({ error: 'No readings found' });
      }

      res.json(readings);
    } catch (error) {
      console.error('Error in getLastReadings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async saveReadings(req, res) {
    try {
      const userId = req.user?.id;
      const { readings } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!readings || typeof readings !== 'object') {
        return res.status(400).json({ error: 'Invalid readings data' });
      }

      const saved = await readingsService.saveReadings(userId, readings);

      res.json({
        message: 'Readings saved successfully',
        data: saved,
      });
    } catch (error) {
      console.error('Error in saveReadings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getReadingsHistory(req, res) {
    try {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit) || 12;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const history = await readingsService.getReadingsHistory(userId, limit);

      res.json({
        count: history.length,
        data: history,
      });
    } catch (error) {
      console.error('Error in getReadingsHistory:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async clearLastReadings(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await readingsService.clearLastReadings(userId);

      res.json({
        message: 'Readings cleared successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error in clearLastReadings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = readingsController;
