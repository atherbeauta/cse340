CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_categories (
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

INSERT INTO categories (name) VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_categories (project_id, category_id)
SELECT project.id, category.id
FROM projects AS project
CROSS JOIN categories AS category
WHERE category.name = 'Community Service'
ON CONFLICT (project_id, category_id) DO NOTHING;
