const db = require('../db/database');

async function getAllOrganizations() {
  const result = await db.query('SELECT * FROM organizations ORDER BY name');
  return result.rows;
}

async function getOrganizationById(id) {
  const result = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getAllProjects() {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date,
            project.organization_id, organization.name AS organization_name
     FROM projects AS project
     LEFT JOIN organizations AS organization ON organization.id = project.organization_id
     ORDER BY project.date NULLS LAST, project.name`
  );
  return result.rows;
}

async function getProjectById(id) {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date,
            project.organization_id, organization.name AS organization_name
     FROM projects AS project
     LEFT JOIN organizations AS organization ON organization.id = project.organization_id
     WHERE project.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function getProjectsByOrganization(orgId) {
  const result = await db.query(
    `SELECT id, name, description, date
     FROM projects
     WHERE organization_id = $1
     ORDER BY date NULLS LAST, name`,
    [orgId]
  );
  return result.rows;
}

async function getAllCategories() {
  const result = await db.query('SELECT * FROM categories ORDER BY name');
  return result.rows;
}

async function getCategoryById(id) {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getCategoriesByProject(projectId) {
  const result = await db.query(
    `SELECT category.id, category.name
     FROM categories AS category
     JOIN project_categories AS assignment ON assignment.category_id = category.id
     WHERE assignment.project_id = $1
     ORDER BY category.name`,
    [projectId]
  );
  return result.rows;
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

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  getAllProjects,
  getProjectById,
  getProjectsByOrganization,
  getAllCategories,
  getCategoryById,
  getCategoriesByProject,
  getProjectsByCategory
};