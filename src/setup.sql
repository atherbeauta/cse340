-- Create Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Create ProjectCategories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert Organizations
INSERT OR IGNORE INTO organizations (id, name, description, image) VALUES
(1, 'Pathway Promise', 'Supporting students with mentorship, scholarships, and community outreach.', '/images/org-1.svg'),
(2, 'Campus Care Collective', 'Delivering wellness programs, volunteer events, and neighborhood improvements.', '/images/org-2.svg'),
(3, 'Innovation Impact', 'Connecting learners with service, sustainability, and technology projects.', '/images/org-3.svg');

-- Insert Categories
INSERT OR IGNORE INTO categories (id, name) VALUES
(1, 'Environment'),
(2, 'Educational'),
(3, 'Community Service'),
(4, 'Health & Wellness');

-- Insert Projects
INSERT OR IGNORE INTO projects (id, name, description, organization_id, date) VALUES
(1, 'Tree Planting Initiative', 'Plant trees and restore green spaces in urban areas.', 1, '2026-06-05'),
(2, 'Scholarship Fund Drive', 'Raise funds to support student scholarships.', 1, '2026-06-20'),
(3, 'Community Garden', 'Build and maintain community gardens for local residents.', 2, '2026-07-01'),
(4, 'Wellness Fair', 'Host annual health and wellness fair for the campus.', 2, '2026-05-20'),
(5, 'Tech for Good', 'Provide technology training to underserved communities.', 3, '2026-06-15'),
(6, 'Disaster Relief', 'Coordinate disaster relief efforts and recovery support.', 3, '2026-08-10');

-- Insert Project-Category associations
INSERT OR IGNORE INTO project_categories (project_id, category_id) VALUES
(1, 1), -- Tree Planting = Environment
(2, 2), -- Scholarship = Educational
(3, 1), -- Community Garden = Environment
(3, 3), -- Community Garden = Community Service
(4, 4), -- Wellness Fair = Health & Wellness
(5, 2), -- Tech for Good = Educational
(5, 3), -- Tech for Good = Community Service
(6, 3), -- Disaster Relief = Community Service
(6, 4); -- Disaster Relief = Health & Wellness
