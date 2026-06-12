const dbHelper = require('../db/database');

module.exports = {
  async createCategory(name) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name });
        }
      );
    });
  },

  async getCategoryById(id) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async updateCategory(id, name) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  async getAllCategories() {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};
