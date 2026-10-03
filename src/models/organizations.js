const db = require('../db/database');

async function getAllOrganizations() {
  try {
    const result = await db.query('SELECT * FROM organizations ORDER BY name');
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { getAllOrganizations };
