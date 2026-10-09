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

async function getCategoryById(id) {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getProjectsByCategory(categoryId) {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date
     FROM projects AS project
     JOIN project_categories AS assignment ON assignment.project_id = project.id
     WHERE assignment.category_id = $1
     ORDER BY project.date NULLS LAST, project.name`,
    [categoryId]
  );
  return result.rows;
}

module.exports = { getAllCategories, getCategoryById, getProjectsByCategory };
