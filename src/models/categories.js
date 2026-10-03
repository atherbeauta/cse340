const db = require('../db/database');

async function getAllCategories() {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { getAllCategories };
