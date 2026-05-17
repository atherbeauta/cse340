import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilisez STRICTEMENT cette syntaxe avec path.join pour Linux
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Vos routes...
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/categories', (req, res) => {
    const categories = ['Environnement', 'Pédagogique', 'Service communautaire', 'Santé et bien-être'];
    res.render('categories', { title: 'Categories', categories });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});