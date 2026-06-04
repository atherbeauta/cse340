const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS organizations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, organization_id INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS project_categories (project_id INTEGER NOT NULL, category_id INTEGER NOT NULL, PRIMARY KEY (project_id, category_id))');
});

db.close(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Database initialized at', dbPath);
});
