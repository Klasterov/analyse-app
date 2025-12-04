const pool = require('../db');

class PricesService {
  async getPricesByMonth(yearMonth) {
    const result = await pool.query(
      `SELECT service, price FROM prices WHERE year_month = $1 ORDER BY service`,
      [yearMonth]
    );
    return result.rows;
  }

  async getPricesObject(yearMonth) {
    const result = await pool.query(
      `SELECT service, price FROM prices WHERE year_month = $1 ORDER BY service`,
      [yearMonth]
    );
    
    const pricesObj = {};
    result.rows.forEach(row => {
      pricesObj[row.service] = parseFloat(row.price);
    });
    return pricesObj;
  }

  async getCurrentMonthPrices() {
    const now = new Date();
    const yearMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    return this.getPricesObject(yearMonth);
  }

  async getAllPrices() {
    const result = await pool.query(
      `SELECT * FROM prices ORDER BY year_month DESC, service ASC`
    );
    return result.rows;
  }

  async setPrices(yearMonth, pricesData) {
    const promises = pricesData.map(item =>
      pool.query(
        `INSERT INTO prices (service, year_month, price)
         VALUES ($1, $2, $3)
         ON CONFLICT (service, year_month) DO UPDATE SET price = EXCLUDED.price
         RETURNING *`,
        [item.service, yearMonth, item.price]
      )
    );
    
    const results = await Promise.all(promises);
    return results.map(r => r.rows[0]);
  }

  async setPrice(service, yearMonth, price) {
    const result = await pool.query(
      `INSERT INTO prices (service, year_month, price)
       VALUES ($1, $2, $3)
       ON CONFLICT (service, year_month) DO UPDATE SET price = EXCLUDED.price
       RETURNING *`,
      [service, yearMonth, price]
    );
    return result.rows[0];
  }
}

module.exports = new PricesService();
