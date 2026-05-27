import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

/**
 * Get all projects from the database with organization and category metadata
 * @returns {Promise<Array>} Promise resolving with projects array
 */
export const getAllProjects = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                o.name AS organization,
                GROUP_CONCAT(c.name, ', ') AS categories
            FROM projects p
            JOIN organizations o ON p.organization_id = o.id
            LEFT JOIN project_categories pc ON p.id = pc.project_id
            LEFT JOIN categories c ON pc.category_id = c.id
            GROUP BY p.id
            ORDER BY p.name
        `;

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => ({
                    ...row,
                    categories: row.categories || 'Uncategorized'
                })));
            }
        });
    });
};

export const getUpcomingProjects = (limit = 5) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.date AS date,
                p.organization_id,
                o.name AS organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.id
            WHERE date(p.date) >= date('now')
            ORDER BY date(p.date) ASC
            LIMIT ?
        `;
        db.all(query, [limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

export const getProjectDetails = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.date AS date,
                p.organization_id,
                o.name AS organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.id
            WHERE p.id = ?
            LIMIT 1
        `;

        db.get(query, [id], (err, project) => {
            if (err) return reject(err);
            if (!project) return resolve(null);

            const catQuery = `
                SELECT c.id, c.name
                FROM categories c
                JOIN project_categories pc ON c.id = pc.category_id
                WHERE pc.project_id = ?
                ORDER BY c.name
            `;
            db.all(catQuery, [id], (err2, categories) => {
                if (err2) return reject(err2);
                project.categories = categories || [];
                resolve(project);
            });
        });
    });
};
