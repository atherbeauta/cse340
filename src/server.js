import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllCategories } from './models/categories.js';
import { getAllOrganizations } from './models/organizations.js';
import { getUpcomingProjects } from './models/projects.js';
import router from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { categories, title: 'Categories' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error retrieving categories');
  }
});

app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { organizations, title: 'Organizations' });
  } catch (err) {
    res.status(500).send('Database error retrieving organizations');
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await getUpcomingProjects(5);
    res.render('projects', { projects, title: 'Projects' });
  } catch (err) {
    res.status(500).send('Database error retrieving projects');
  }
});

app.use(router);

app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

app.listen(PORT, () => {
  console.log(`W02 app running on http://localhost:${PORT}`);
});
