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
