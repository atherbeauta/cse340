const db = require('../db/database');

async function getAllCategories() {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving categories:', error);
    throw error;
  }
}

module.exports = { getAllCategories };
