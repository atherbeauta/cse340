const db = require('../db/database');

async function getAllProjects() {
  try {
    const result = await db.query(
      `SELECT project.id, project.name, project.description, project.date,
              organization.name AS organization_name
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

module.exports = { getAllProjects };
