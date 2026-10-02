const db = require('../db/database');

async function getAllOrganizations() {
  try {
    const result = await db.query('SELECT * FROM organizations ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving organizations:', error);
    throw error;
  }
}

module.exports = { getAllOrganizations };
