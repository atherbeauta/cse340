const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');

function initializeDatabase() {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Unable to open SQLite database file:', dbPath);
      console.error(err);
      return;
    }
  });

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS organizations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, organization_id INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS project_categories (project_id INTEGER NOT NULL, category_id INTEGER NOT NULL, PRIMARY KEY (project_id, category_id))');
  });

  db.close((err) => {
    if (err) {
      console.error('Failed to close the SQLite database after initialization:', err);
    }
  });
}

initializeDatabase();

module.exports = {
  getDb() {
    return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Unable to open SQLite database file:', dbPath);
        console.error(err);
      }
    });
  },
  getDbPath() {
    return dbPath;
  }
};
