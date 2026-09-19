import db from '../db/database.js';

export const getAllOrganizations = async () => {
  const result = await db.query('SELECT * FROM organizations ORDER BY name');
  return result.rows;
};

export const getOrganizationById = async (id) => {
  const result = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
  return result.rows[0];
};

export const getProjectsByOrganizationId = async (id) => {
  const result = await db.query(
    'SELECT * FROM projects WHERE organization_id = $1 ORDER BY date',
    [id]
  );
  return result.rows;
};
