import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import { getAllCategories } from './src/models/categories.js';

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

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Categories route
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.render('categories', { title: 'Categories', categories: [] });
    }
});

// Organizations route
app.get('/organizations', (req, res) => {
    const organizations = [
        {
            name: 'Pathway Promise',
            image: '/images/org-1.svg',
            description: 'Supporting students with mentorship, scholarships, and community outreach.'
        },
        {
            name: 'Campus Care Collective',
            image: '/images/org-2.svg',
            description: 'Delivering wellness programs, volunteer events, and neighborhood improvements.'
        },
        {
            name: 'Innovation Impact',
            image: '/images/org-3.svg',
            description: 'Connecting learners with service, sustainability, and technology projects.'
        }
    ];
    res.render('organizations', { title: 'Organizations', organizations });
});


// Server activation
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});