const dbHelper = require('../db/database');

module.exports = {
  async createOrganization(name, description, city, state) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'INSERT INTO organizations (name, description, city, state) VALUES (?, ?, ?, ?)',
        [name, description, city, state],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name, description, city, state });
        }
      );
    });
  },

  async getAllOrganizations() {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.all('SELECT * FROM organizations ORDER BY name', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  async getOrganizationById(id) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.get('SELECT * FROM organizations WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async updateOrganization(id, name, description, city, state) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'UPDATE organizations SET name = ?, description = ?, city = ?, state = ? WHERE id = ?',
        [name, description, city, state, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};
