const pricesService = require('../services/pricesService');

exports.getCurrentMonthPrices = async (req, res) => {
  try {
    const prices = await pricesService.getCurrentMonthPrices();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении цен' });
  }
};

exports.getPricesByMonth = async (req, res) => {
  try {
    const { yearMonth } = req.params;
    const prices = await pricesService.getPricesObject(yearMonth);
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении цен' });
  }
};

exports.getAllPrices = async (req, res) => {
  try {
    const prices = await pricesService.getAllPrices();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении цен' });
  }
};

exports.setPrices = async (req, res) => {
  try {
    const { yearMonth, prices } = req.body;
    
    if (!yearMonth || !prices) {
      return res.status(400).json({ error: 'Необходимы yearMonth и prices' });
    }
    
    const result = await pricesService.setPrices(yearMonth, prices);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении цен' });
  }
};

exports.setPrice = async (req, res) => {
  try {
    const { service, yearMonth, price } = req.body;
    
    if (!service || !yearMonth || price === undefined) {
      return res.status(400).json({ error: 'Необходимы service, yearMonth и price' });
    }
    
    const result = await pricesService.setPrice(service, yearMonth, price);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении цены' });
  }
};
