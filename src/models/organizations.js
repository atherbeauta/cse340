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

async function getOrganizationById(id) {
  const result = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
  return result.rows[0] || null;
}

module.exports = { getAllOrganizations, getOrganizationById };
