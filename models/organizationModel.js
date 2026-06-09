const dbHelper = require('../db/database');

function getDb() {
  return dbHelper.getDb();
}

module.exports = {
  async createOrganization(name, description, city, state) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'INSERT INTO organizations (name, description, city, state) VALUES (?, ?, ?, ?)',
        [name, description, city, state],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve({ id: this.lastID, name, description, city, state });
        }
      );
    });
  },

  async getAllOrganizations() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all('SELECT * FROM organizations ORDER BY name', [], (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  async getOrganizationById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get('SELECT * FROM organizations WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async updateOrganization(id, name, description, city, state) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'UPDATE organizations SET name = ?, description = ?, city = ?, state = ? WHERE id = ?',
        [name, description, city, state, id],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};
