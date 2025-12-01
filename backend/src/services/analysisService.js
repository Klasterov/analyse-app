const pool = require('../db');

class AnalysisService {
  async add(region, service, period, values) {
    const result = await pool.query(
      `INSERT INTO analysis_data (region, service, period, values)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [region, service, period, values]
    );
    return {
      ...result.rows[0],
      values: result.rows[0].values.map(Number)
    };
  }

  async get(region, service) {
    const result = await pool.query(
      `SELECT * FROM analysis_data WHERE region=$1 AND service=$2 ORDER BY created_at DESC`,
      [region, service]
    );
    return result.rows.map(r => ({
      ...r,
      values: r.values.map(Number) 
    }));
  }

  async getAll() {
    const result = await pool.query(`SELECT * FROM analysis_data ORDER BY created_at DESC`);
    return result.rows.map(r => ({
      ...r,
      values: r.values.map(Number)
    }));
  }

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM analysis_data WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0] ? {
      ...result.rows[0],
      values: result.rows[0].values.map(Number)
    } : null;
  }
  async getRegions() {
    const result = await pool.query(`SELECT DISTINCT region FROM analysis_data`);
    return result.rows.map(r => r.region);
  }

  async getServices() {
    const result = await pool.query(`SELECT DISTINCT service FROM analysis_data`);
    return result.rows.map(r => r.service);
  }
}
  


module.exports = new AnalysisService();