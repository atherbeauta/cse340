import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// 1. LINK TO DIRECTORIES: Recreate __dirname for ES Modules compatibility on Linux/Render
// This allows the server to locate your 'views' and 'public' folders regardless of the OS (Windows or Linux).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. LINK TO TEMPLATE ENGINE: Set up view engine and absolute views directory path
// This links Express to your EJS files inside the 'views' folder.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. LINK TO STATIC ASSETS: Serve static assets (CSS, images) from the public directory
// This links your HTML/EJS files to the '/css/styles.css' file inside the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES (LINKS TO PAGES) ---

// Home route: Links the root URL '/' to 'views/index.ejs'
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Categories route: Links the URL '/categories' to 'views/categories.ejs'
app.get('/categories', (req, res) => {
    const categoriesArray = ['Environment', 'Educational', 'Community Service', 'Health & Wellness'];
    res.render('categories', { title: 'Categories', categories: categoriesArray });
});

// 4. LINK TO PORT: Server activation on Render port or local port 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});