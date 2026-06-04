const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const categoryRoutes = require('./routes/categoryRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'cse340-secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', categoryRoutes);
app.use('/', organizationRoutes);
app.use('/', projectRoutes);

app.get('/', (req, res) => {
  res.redirect('/projects');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
