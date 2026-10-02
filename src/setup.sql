CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  website VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE,
  organization_id INT REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_categories (
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

INSERT INTO organizations (name, website)
SELECT 'Community Food Bank', 'https://example.org/food-bank'
WHERE NOT EXISTS (
  SELECT 1 FROM organizations WHERE name = 'Community Food Bank'
);

INSERT INTO organizations (name, website)
SELECT 'Green Earth Alliance', 'https://example.org/green-earth'
WHERE NOT EXISTS (
  SELECT 1 FROM organizations WHERE name = 'Green Earth Alliance'
);

INSERT INTO projects (name, description, date, organization_id)
SELECT 'Neighborhood Food Drive', 'Collect and distribute food to local families.', DATE '2026-10-10', organization.id
FROM organizations AS organization
WHERE organization.name = 'Community Food Bank'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Neighborhood Food Drive');

INSERT INTO projects (name, description, date, organization_id)
SELECT 'Community Garden Cleanup', 'Prepare shared garden beds for the new growing season.', DATE '2026-10-17', organization.id
FROM organizations AS organization
WHERE organization.name = 'Green Earth Alliance'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Community Garden Cleanup');

INSERT INTO categories (name) VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_categories (project_id, category_id)
SELECT project.id, category.id
FROM projects AS project
JOIN categories AS category ON
  (project.name = 'Neighborhood Food Drive' AND category.name IN ('Community Service', 'Health and Wellness'))
  OR (project.name = 'Community Garden Cleanup' AND category.name IN ('Environmental', 'Community Service'))
ON CONFLICT (project_id, category_id) DO NOTHING;
