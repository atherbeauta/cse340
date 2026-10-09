const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');
const path = require('path');
const db = require('./db/database');
const w04Routes = require('./routes/w04');
const w03Routes = require('./routes/w03');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'cse340-development-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use(w04Routes);
app.use(w03Routes);

app.use((req, res) => {
  res.status(404).render('w03/404', { title: 'Page Not Found', path: req.path });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render('w03/500', { title: 'Server Error' });
});

async function startServer() {
  try {
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    await db.query(setupSql);
    app.listen(PORT, () => {
      console.log(`W04 MVC app running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize PostgreSQL database:', error);
    await db.end();
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();

module.exports = { app, startServer };