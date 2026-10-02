const express = require('express');
const path = require('path');
const { getAllCategories } = require('./models/categories');
const { getAllOrganizations } = require('./models/organizations');
const { getAllProjects } = require('./models/projects');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => res.redirect('/organizations'));

app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Categories', categories });
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
    const projects = await getAllProjects();
    res.render('projects', { projects, title: 'Projects' });
  } catch (err) {
    res.status(500).send('Database error retrieving projects');
  }
});

app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

app.listen(PORT, () => {
  console.log(`W02 app running on http://localhost:${PORT}`);
});
