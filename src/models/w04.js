const db = require('../db/database');

async function getOrganizationById(id) {
  const result = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createOrganization({ name, website }) {
  const result = await db.query(
    'INSERT INTO organizations (name, website) VALUES ($1, $2) RETURNING *',
    [name, website || null]
  );
  return result.rows[0];
}

async function updateOrganization(id, { name, website }) {
  const result = await db.query(
    'UPDATE organizations SET name = $1, website = $2 WHERE id = $3 RETURNING *',
    [name, website || null, id]
  );
  return result.rows[0] || null;
}

async function getCategoryById(id) {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createCategory({ name }) {
  const result = await db.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

async function updateCategory(id, { name }) {
  const result = await db.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0] || null;
}

async function getProjectById(id) {
  const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getProjectCategoryIds(projectId) {
  const result = await db.query(
    'SELECT category_id FROM project_categories WHERE project_id = $1 ORDER BY category_id',
    [projectId]
  );
  return result.rows.map((row) => String(row.category_id));
}

async function createProject(project, categoryIds = []) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO projects (name, description, date, organization_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [project.name, project.description || null, project.date || null, project.organization_id || null]
    );
    for (const categoryId of categoryIds) {
      await client.query(
        'INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)',
        [result.rows[0].id, categoryId]
      );
    }
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateProject(id, project, categoryIds = []) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE projects
       SET name = $1, description = $2, date = $3, organization_id = $4
       WHERE id = $5 RETURNING *`,
      [project.name, project.description || null, project.date || null, project.organization_id || null, id]
    );
    if (!result.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query('DELETE FROM project_categories WHERE project_id = $1', [id]);
    for (const categoryId of categoryIds) {
      await client.query(
        'INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)',
        [id, categoryId]
      );
    }
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getOrganizationById,
  createOrganization,
  updateOrganization,
  getCategoryById,
  createCategory,
  updateCategory,
  getProjectById,
  getProjectCategoryIds,
  createProject,
  updateProject
};