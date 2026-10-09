const db = require('../db/database');

async function getAllProjects() {
  try {
    const result = await db.query(
      `SELECT project.id, project.name, project.description, project.date,
              project.organization_id, organization.name AS organization_name
       FROM projects AS project
       LEFT JOIN organizations AS organization ON project.organization_id = organization.id
       ORDER BY project.date, project.name`
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getUpcomingProjects(numberOfProjects) {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date,
            project.organization_id, organization.name AS organization_name
     FROM projects AS project
     LEFT JOIN organizations AS organization ON project.organization_id = organization.id
     WHERE project.date >= CURRENT_DATE
     ORDER BY project.date ASC, project.name
     LIMIT $1`,
    [numberOfProjects]
  );
  return result.rows;
}

async function getProjectById(id) {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date,
            project.organization_id, organization.name AS organization_name
     FROM projects AS project
     LEFT JOIN organizations AS organization ON project.organization_id = organization.id
     WHERE project.id = $1`,
    [id]
  );
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

async function getProjectsByOrganization(organizationId) {
  const result = await db.query(
    `SELECT id, name, description, date
     FROM projects
     WHERE organization_id = $1
     ORDER BY date NULLS LAST, name`,
    [organizationId]
  );
  return result.rows;
}

module.exports = {
  getAllProjects,
  getUpcomingProjects,
  getProjectById,
  getCategoriesByProject,
  getProjectsByOrganization
};
