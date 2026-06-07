const dbHelper = require('../db/database');

exports.getAllOrganizations = async function () {
  const db = dbHelper.getDb();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM organizations ORDER BY name', [], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.getOrganizationById = async function (id) {
  const db = dbHelper.getDb();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM organizations WHERE id = ?', [id], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row);
    });
  });
};
