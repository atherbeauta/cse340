const express = require('express');
const path = require('path');
const db = require('./db/database');
const categoriesModel = require('./models/categories');
const organizationsModel = require('./models/organizations');
const projectsModel = require('./models/projects');

const app = express();
const PORT = process.env.PORT || 3001;

db.initializeDatabase();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/organizations');
});

app.get('/organizations', async (req, res) => {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('organizations', { organizations });
  } catch (err) {
    res.status(500).send('Database error retrieving organizations');
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await projectsModel.getAllProjects();
    res.render('projects', { projects });
  } catch (err) {
    res.status(500).send('Database error retrieving projects');
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('categories', { categories });
  } catch (err) {
    res.status(500).send('Database error retrieving categories');
  }
});

app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

app.listen(PORT, () => {
  console.log(`W02 app running on http://localhost:${PORT}`);
});
