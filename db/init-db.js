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
  db.run('PRAGMA foreign_keys = ON');
  
  db.run('DROP TABLE IF EXISTS project_categories');
  db.run('DROP TABLE IF EXISTS categories');
  db.run('DROP TABLE IF EXISTS projects');
  db.run('DROP TABLE IF EXISTS organizations');
  
  db.run(`CREATE TABLE organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL
  )`);
  
  db.run(`CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    organization_id INTEGER NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  )`);
  
  db.run(`CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);
  
  db.run(`CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);
  
  db.run(`INSERT INTO organizations (name, description, city, state) VALUES
    ('Hope Community Center', 'Provides food, education, and community support.', 'Boise', 'ID'),
    ('Valley Health Network', 'Offers health services and wellness programs.', 'Provo', 'UT')`);
  
  db.run(`INSERT INTO projects (name, description, date, organization_id) VALUES
    ('Summer Food Drive', 'Collect and distribute food to families in need.', '2026-07-05', 1),
    ('Neighborhood Cleanup', 'Organize volunteers to clean parks and streets.', '2026-07-12', 1),
    ('Youth Tutoring Program', 'Provide tutoring support for local students.', '2026-07-19', 1),
    ('Community Garden Build', 'Create a shared garden space for residents.', '2026-07-26', 1),
    ('Senior Care Visit', 'Spend time with seniors and assist where needed.', '2026-08-02', 1),
    ('Health Screening Fair', 'Offer free health checks and wellness education.', '2026-07-08', 2),
    ('Immunization Clinic', 'Support vaccination clinics for the neighborhood.', '2026-07-15', 2),
    ('Fitness in the Park', 'Host outdoor fitness sessions for all ages.', '2026-07-22', 2),
    ('Mental Health Workshop', 'Provide workshops on stress management.', '2026-07-29', 2),
    ('Nutrition Classes', 'Teach healthy cooking and meal planning.', '2026-08-05', 2)`);
  
  db.run(`INSERT INTO categories (name) VALUES
    ('Environment'),
    ('Education'),
    ('Health')`);
  
  db.run(`INSERT INTO project_categories (project_id, category_id) VALUES
    (1, 2),
    (2, 1),
    (3, 2),
    (4, 1),
    (5, 2),
    (6, 3),
    (7, 3),
    (8, 3),
    (9, 3),
    (10, 3)`);
});

db.close(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Database initialized at', dbPath);
});
