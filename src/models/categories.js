const dbHelper = require('../db/database');

exports.getAllCategories = async function () {
  const db = dbHelper.getDb();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
