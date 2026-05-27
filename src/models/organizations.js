import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

/**
 * Get all organizations from the database
 * @returns {Promise<Array>} Promise resolving with organizations array
 */
export const getAllOrganizations = () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT id, name, description, image FROM organizations ORDER BY name',
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
};

export const getOrganizationById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, name, description, image FROM organizations WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
        });
    });
};

export const getProjectsByOrganizationId = (organizationId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.id, p.name, p.description
            FROM projects p
            WHERE p.organization_id = ?
            ORDER BY p.name
        `;
        db.all(query, [organizationId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};
