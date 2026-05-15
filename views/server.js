import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware pour les fichiers statiques
app.use(express.static('public'));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/organizations', (req, res) => {
    res.render('organizations', { title: 'Organizations' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Service Projects' });
});

// Nouvelle route pour les catégories
app.get('/categories', (req, res) => {
    const categories = [
        'Environnement',
        'Pédagogique',
        'Service communautaire',
        'Santé et bien-être'
    ];
    res.render('categories', { title: 'Categories', categories });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});