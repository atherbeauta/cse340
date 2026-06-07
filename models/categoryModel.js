const dbHelper = require('../db/database');

function getDb() {
  return dbHelper.getDb();
}

module.exports = {
  createCategory(name) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve({ id: this.lastID, name });
        }
      );
    });
  },

  getCategoryById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  updateCategory(id, name) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  getAllCategories() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};
