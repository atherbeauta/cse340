const dbHelper = require('../db/database');

module.exports = {
  async createProject(name, description, date, organizationId) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'INSERT INTO projects (name, description, date, organization_id) VALUES (?, ?, ?, ?)',
        [name, description || '', date || '', organizationId || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name, description, date, organizationId });
        }
      );
    });
  },

  async getAllProjects() {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.all(
        `SELECT p.*, o.name AS organizationName
         FROM projects p
         LEFT JOIN organizations o ON p.organization_id = o.id
         ORDER BY p.date, p.name`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  async getProjectById(id) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.get(
        `SELECT p.*, o.name AS organizationName
         FROM projects p
         LEFT JOIN organizations o ON p.organization_id = o.id
         WHERE p.id = ?`,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  async updateProject(id, name, description, date, organizationId) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.run(
        'UPDATE projects SET name = ?, description = ?, date = ?, organization_id = ? WHERE id = ?',
        [name, description || '', date || '', organizationId || null, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  async getProjectCategoryIds(projectId) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.all(
        'SELECT category_id FROM project_categories WHERE project_id = ?',
        [projectId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map(r => r.category_id));
        }
      );
    });
  },

  async setProjectCategories(projectId, categoryIds) {
    return new Promise((resolve, reject) => {
      const db = dbHelper.getDb();
      db.serialize(() => {
        db.run('DELETE FROM project_categories WHERE project_id = ?', [projectId], err => {
          if (err) return reject(err);
          const stmt = db.prepare('INSERT INTO project_categories (project_id, category_id) VALUES (?, ?)');
          if (categoryIds && categoryIds.length) {
            categoryIds.forEach(categoryId => {
              stmt.run(projectId, categoryId);
            });
          }
          stmt.finalize(err2 => {
            if (err2) return reject(err2);
            resolve();
          });
        });
      });
    });
  }
};
