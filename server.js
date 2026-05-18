import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

// --- ROUTES ---

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Categories route
app.get('/categories', (req, res) => {
    const categoriesArray = ['Environment', 'Educational', 'Community Service', 'Health & Wellness'];
    res.render('categories', { title: 'Categories', categories: categoriesArray });
});

// Server activation
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});