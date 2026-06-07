const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'database.sqlite');
const setupSqlPath = path.join(__dirname, '..', 'setup.sql');

function initializeDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    return;
  }

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Unable to create W02 database:', err);
    }
  });

  const setupSql = fs.readFileSync(setupSqlPath, 'utf8');
  db.exec(setupSql, (err) => {
    if (err) {
      console.error('Unable to initialize W02 database:', err);
    }
    db.close();
  });
}

function getDb() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Unable to open W02 database:', err);
    }
  });
  db.run('PRAGMA foreign_keys = ON');
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};
