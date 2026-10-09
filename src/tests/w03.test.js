const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const db = require('../db/database');

const organizations = [{ id: 1, name: 'Community Food Bank', website: 'https://example.org/food-bank' }];
const categories = [{ id: 2, name: 'Community Service' }];
const project = {
  id: 3,
  name: 'Neighborhood Food Drive',
  description: 'Collect food for local families.',
  date: '2026-10-10',
  organization_id: 1,
  organization_name: 'Community Food Bank'
};
const upcomingProjects = Array.from({ length: 5 }, (_, index) => ({
  ...project,
  id: index + 3,
  name: `Upcoming Project ${index + 1}`
}));

let server;
let baseUrl;
let failCategoryList = false;
let upcomingLimit;

db.query = async (sql, values = []) => {
  if (failCategoryList && sql.includes('SELECT * FROM categories ORDER BY name')) {
    throw new Error('Simulated database failure');
  }
  if (sql.includes('WHERE project.date >= CURRENT_DATE')) {
    upcomingLimit = values[0];
    return { rows: upcomingProjects };
  }
  if (sql.includes('FROM organizations WHERE id = $1')) return { rows: organizations };
  if (sql.includes('FROM organizations ORDER BY name')) return { rows: organizations };
  if (sql.includes('WHERE organization_id = $1')) return { rows: [project] };
  if (sql.includes('WHERE project.id = $1')) return { rows: [project] };
  if (sql.includes('assignment.project_id = $1')) return { rows: categories };
  if (sql.includes('FROM categories WHERE id = $1')) return { rows: categories };
  if (sql.includes('SELECT * FROM categories ORDER BY name')) return { rows: categories };
  if (sql.includes('assignment.category_id = $1')) return { rows: [project] };
  throw new Error(`Unexpected query: ${sql}`);
};

before(async () => {
  const { app } = require('../server');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('W03 directories, detail relationships, upcoming limit, and error pages render', async () => {
  const cases = [
    ['/organizations', 'href="/organization/1"'],
    ['/organization/1', 'href="/project/3"'],
    ['/projects', 'Upcoming Project 5'],
    ['/organizations/new', 'name="name"'],
    ['/projects/new', 'name="organization_id"'],
    ['/categories/new', 'name="name"'],
    ['/project/3', 'href="/organization/1"'],
    ['/project/3', 'href="/category/2"'],
    ['/categories', 'href="/category/2"'],
    ['/category/2', 'href="/project/3"']
  ];

  for (const [route, expected] of cases) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.ok(html.includes(expected), `${route} should include ${expected}`);
  }

  assert.equal(upcomingLimit, 5);
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const notFound = await fetch(`${baseUrl}/category/not-an-id`);
    assert.equal(notFound.status, 404);
    assert.match(await notFound.text(), /This page isn't here/);

    const testError = await fetch(`${baseUrl}/test-error`);
    assert.equal(testError.status, 500);
    assert.match(await testError.text(), /Something went wrong/);

    failCategoryList = true;
    const databaseError = await fetch(`${baseUrl}/categories`);
    assert.equal(databaseError.status, 500);
    assert.match(await databaseError.text(), /Something went wrong/);
  } finally {
    console.error = originalConsoleError;
  }
});