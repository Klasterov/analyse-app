const analysisService = require('../services/analysisService');

exports.addData = async (req, res) => {
  let { region, service, period, values } = req.body;

  try {
    if (period === "week") {
      const weekLength = 7;
      const parsed = values.map(Number);

      while (parsed.length < weekLength) {
        parsed.push(0);
      }

      values = parsed.slice(0, weekLength);
    }

    const data = await analysisService.add(region, service, period, values);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при добавлении данных" });
  }
};


exports.getData = async (req, res) => {
  const { region, service } = req.params;
  try {
    const data = await analysisService.get(region, service);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
};

exports.deleteData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await analysisService.delete(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении данных' });
  }
};
exports.getRegions = async (req, res) => {
  try {
    const regions = await analysisService.getRegions();
    res.json(regions);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения регионов" });
  }
};
exports.getServices = async (req, res) => {
  try {
    const services = await analysisService.getServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения сервисов" });
  }
};

exports.getLatestMonthData = async (req, res) => {
  const { region, service } = req.params;
  try {
    const data = await analysisService.getLatestMonthData(region, service);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении данных последнего месяца' });
  }
};

