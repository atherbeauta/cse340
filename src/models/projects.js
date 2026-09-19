import db from '../db/database.js';

export const getUpcomingProjects = async (limit = 5) => {
  const result = await db.query(
    `SELECT project.id, project.name, project.description, project.date,
            organization.name AS organization_name
     FROM projects AS project
     JOIN organizations AS organization ON project.organization_id = organization.id
     ORDER BY project.date
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getProjectDetails = async (id) => {
  const result = await db.query(
    `SELECT project.*, organization.name AS organization_name
     FROM projects AS project
     JOIN organizations AS organization ON project.organization_id = organization.id
     WHERE project.id = $1`,
    [id]
  );
  return result.rows[0];
};
