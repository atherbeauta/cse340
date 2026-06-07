const dbHelper = require('../db/database');

function getDb() {
  return dbHelper.getDb();
}

module.exports = {
  createProject(name, description, organizationId) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'INSERT INTO projects (name, description, organization_id) VALUES (?, ?, ?)',
        [name, description || '', organizationId || null],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve({ id: this.lastID, name, description, organizationId });
        }
      );
    });
  },

  getAllProjects() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all(
        `SELECT p.*, o.name AS organizationName
         FROM projects p
         LEFT JOIN organizations o ON p.organization_id = o.id
         ORDER BY p.name`,
        [],
        (err, rows) => {
          db.close();
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  getProjectById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get(
        `SELECT p.*, o.name AS organizationName
         FROM projects p
         LEFT JOIN organizations o ON p.organization_id = o.id
         WHERE p.id = ?`,
        [id],
        (err, row) => {
          db.close();
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  updateProject(id, name, description, organizationId) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        'UPDATE projects SET name = ?, description = ?, organization_id = ? WHERE id = ?',
        [name, description || '', organizationId || null, id],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  getProjectCategoryIds(projectId) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all(
        'SELECT category_id FROM project_categories WHERE project_id = ?',
        [projectId],
        (err, rows) => {
          db.close();
          if (err) return reject(err);
          resolve(rows.map(r => r.category_id));
        }
      );
    });
  },

  setProjectCategories(projectId, categoryIds) {
    return new Promise((resolve, reject) => {
      const db = getDb();
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
            db.close();
            if (err2) return reject(err2);
            resolve();
          });
        });
      });
    });
  }
};
