const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');
const path = require('path');
const db = require('./db/database');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);
app.use((req, res, next) => {
  if (NODE_ENV === 'development') console.log(`${req.method} ${req.url}`);
  res.locals.NODE_ENV = NODE_ENV;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'cse340-development-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: NODE_ENV === 'production' }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});
app.use(router);

app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error('Error occurred:', error.message);
  if (NODE_ENV === 'development') console.error(error.stack);
  if (res.headersSent) return next(error);
  const status = error.status || 500;
  const template = status === 404 ? 'w03/404' : 'w03/500';
  res.status(status).render(template, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    path: req.path,
    error: error.message,
    stack: error.stack
  });
});

async function startServer() {
  try {
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    await db.query(setupSql);
    app.listen(PORT, () => {
      console.log(`W03 MVC app running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize PostgreSQL database:', error);
    await db.end();
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();

module.exports = { app, startServer };
