const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');

function getDb() {
  return new sqlite3.Database(dbPath);
}

module.exports = {
  createOrganization(name) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'INSERT INTO organizations (name) VALUES (?)',
        [name],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve({ id: this.lastID, name });
        }
      );
    });
  },

  getAllOrganizations() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all('SELECT * FROM organizations ORDER BY name', [], (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getOrganizationById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get('SELECT * FROM organizations WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  updateOrganization(id, name) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'UPDATE organizations SET name = ? WHERE id = ?',
        [name, id],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};
