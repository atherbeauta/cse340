import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import { getAllCategories } from './src/models/categories.js';
import router from './src/routes.js';

const app = express();

// Recreate __dirname for ES Modules compatibility on Linux/Render
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up view engine and absolute views directory path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve CSS from the project css folder and other static assets from public
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const initializeDatabase = () => {
    const db = new sqlite3.Database(path.join(__dirname, 'src/database.db'));
    const sql = fs.readFileSync(path.join(__dirname, 'src/setup.sql'), 'utf8');
    
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
    
    db.close();
};

// Initialize database on startup
initializeDatabase();

// --- ROUTES ---

// Provide the current year to all templates dynamically
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

// Register application routes from src/routes.js
app.use('/', router);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500');
});


// Server activation
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});