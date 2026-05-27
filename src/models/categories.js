import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

/**
 * Get all categories from the database
 * @returns {Promise} Promise that resolves with array of categories
 */
export const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM categories ORDER BY name', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

export const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, name FROM categories WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
        });
    });
};

export const getCategoriesByProjectId = (projectId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT c.id, c.name
            FROM categories c
            JOIN project_categories pc ON c.id = pc.category_id
            WHERE pc.project_id = ?
            ORDER BY c.name
        `;
        db.all(query, [projectId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

export const getProjectsByCategoryId = (categoryId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.id, p.name, p.description, p.organization_id
            FROM projects p
            JOIN project_categories pc ON p.id = pc.project_id
            WHERE pc.category_id = ?
            ORDER BY p.name
        `;
        db.all(query, [categoryId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};
