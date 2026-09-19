import db from '../db/database.js';

export const getAllCategories = async () => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving category:', error);
    throw error;
  }
};

export const getProjectsByCategoryId = async (id) => {
  try {
    const result = await db.query(
      `SELECT project.*
       FROM projects AS project
       JOIN project_categories AS link ON link.project_id = project.id
       WHERE link.category_id = $1
       ORDER BY project.date`,
      [id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error retrieving category projects:', error);
    throw error;
  }
};

export const getCategoriesByProjectId = async (id) => {
  try {
    const result = await db.query(
      `SELECT category.*
       FROM categories AS category
       JOIN project_categories AS link ON link.category_id = category.id
       WHERE link.project_id = $1
       ORDER BY category.name`,
      [id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error retrieving project categories:', error);
    throw error;
  }
};
