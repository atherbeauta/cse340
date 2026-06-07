const dbHelper = require('../db/database');

exports.getAllProjects = async function () {
  const db = dbHelper.getDb();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.id, p.name, p.description, p.date, o.name AS organization_name
       FROM projects p
       JOIN organizations o ON p.organization_id = o.id
       ORDER BY p.date`,
      [],
      (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};
