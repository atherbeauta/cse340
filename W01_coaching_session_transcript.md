# W01 Coaching Session Transcript

AI Coach: Welcome! Today we are reviewing how the server-side app works in Week 1. We will talk about Express routing, JavaScript concepts, EJS partials and pages, and frontend CSS. This is a coaching session, so it is okay to say when something is uncertain.

Student: Thank you. I want to make sure I explain the important concepts clearly.

AI Coach: Great. Let’s begin with Express routing. Please explain how the app starts and how routes are connected in the server.

Student: In `server.js`, I create an Express app and mount the route files for categories, organizations, and projects.

```js
const express = require('express');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', categoryRoutes);
app.use('/', organizationRoutes);
app.use('/', projectRoutes);

app.get('/', (req, res) => {
  res.redirect('/projects');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Student: Express routing works by matching the URL path to a route handler. For example, `app.use('/', categoryRoutes)` allows the category routes to respond to requests like `/categories` and `/new-category`. The app also redirects `/` to `/projects`, which makes the app open on the project page by default.

AI Coach: Excellent. That explains the request flow clearly.

AI Coach: Next, let’s discuss JavaScript principles. What JavaScript ideas are important in this project?

Student: I used JavaScript features such as `const`, `require`, arrow functions, template literals, and object destructuring. These make the code easier to read and maintain.

```js
const express = require('express');
const { body, validationResult } = require('express-validator');

exports.createCategory = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).render('categories/new', { errors: errors.array(), old: { name } });
    }

    try {
      await categoryModel.createCategory(name);
      req.flash('success', 'Category created');
      res.redirect('/categories');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];
```

Student: The code uses `const` to define values that should not be reassigned. `require` brings in modules such as Express and express-validator. The `body()` function validates submitted form data, and `const { name } = req.body` shows destructuring, which extracts one property from an object. JavaScript is useful because it allows us to handle form submission logic directly in the server and respond appropriately to errors or successful saves.

AI Coach: Good. That shows a real understanding of the language in context.

AI Coach: Now let’s talk about EJS partials and pages. How are the pages organized in this app?

Student: The app uses EJS templates for the page structure. The main layout is in `views/layout.ejs`, and partials are stored in `views/partials`.

```ejs
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= title || 'CSE340 App' %></title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>CSE340 App</h1>
      <nav>
        <a href="/projects">Projects</a>
        <a href="/organizations">Organizations</a>
        <a href="/categories">Categories</a>
      </nav>
    </header>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

Student: This layout defines the shared structure used across the app. The `body` variable is filled by each page. Then each page such as `views/categories/list.ejs` includes the partial header and footer, and inserts the page content in the middle.

```ejs
<%- include('../partials/header', { title: 'Categories' }) %>
<section>
  <h2>Categories</h2>
  <ul>
    <% categories.forEach(function(cat){ %>
      <li><a href="/categories/<%= cat.id %>"><%= cat.name %></a></li>
    <% }) %>
  </ul>
  <a class="button" href="/new-category">Create new category</a>
</section>
<%- include('../partials/footer') %>
```

Student: EJS partials help the site stay consistent. They reduce duplication and make it easier to reuse the same header, navigation, and footer across all pages.

AI Coach: Perfect. That is exactly the concept the rubric is looking for.

AI Coach: Finally, let’s discuss frontend CSS. What role does the CSS play in this project?

Student: The CSS defines the visual design, layout, colors, spacing, and responsive behavior. The app uses a shared stylesheet in `public/styles.css` and it is served through Express static middleware.

```js
app.use(express.static(path.join(__dirname, 'public')));
```

```css
body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: linear-gradient(180deg, #eef4ff 0%, #f8fcff 55%, #ffffff 100%);
  color: #20334f;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.82);
  border-bottom: 1px solid rgba(32, 51, 79, 0.12);
}

.site-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.25rem;
  border-radius: 999px;
  background: rgba(64, 96, 255, 0.14);
  color: #4060ff;
  font-weight: 600;
}
```

Student: The CSS gives the site a more professional look and makes the layout easier to read. It also includes responsive styling so the navigation can adapt on smaller screens.

AI Coach: Excellent. That covers the four required topics: Express routing, JavaScript, EJS partials/pages, and frontend CSS.

Student: Yes, I understand. This coaching session explains the important concepts and shows real code examples from the project.

AI Coach: Great work. This transcript should be ready to submit.
