const { body, validationResult } = require('express-validator');
const models = require('../models/w04');
const directory = require('../models/w03');

const nameRules = () => body('name').trim().notEmpty().withMessage('Name is required')
  .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters');

const organizationRules = [
  nameRules(),
  body('website').trim().optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage('Website must be 255 characters or fewer')
    .bail().isURL({ require_protocol: true }).withMessage('Enter a valid URL including https://')
];

const categoryRules = [nameRules()];

const projectRules = [
  nameRules(),
  body('description').trim().isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer'),
  body('date').trim().optional({ checkFalsy: true }).isISO8601().withMessage('Enter a valid date'),
  body('organization_id').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Choose a valid organization'),
  body('category_ids').optional().isArray().withMessage('Choose valid categories'),
  body('category_ids.*').optional().isInt({ min: 1 }).withMessage('Choose valid categories')
];

function posted(req, keys) {
  return Object.fromEntries(keys.map((key) => [key, req.body[key] || '']));
}

function normalizeCategoryIds(req, res, next) {
  if (req.body.category_ids !== undefined && !Array.isArray(req.body.category_ids)) {
    req.body.category_ids = [req.body.category_ids];
  }
  next();
}

async function renderProjectForm(res, { title, action, old, errors }) {
  const [organizations, categories] = await Promise.all([
    directory.getAllOrganizations(),
    directory.getAllCategories()
  ]);
  return res.status(errors ? 400 : 200).render('w04/project-form', {
    title, action, old, errors: errors || [], organizations, categories
  });
}

async function renderOrganizationForm(res, { title, action, old, errors }) {
  return res.status(errors ? 400 : 200).render('w04/organization-form', {
    title, action, old, errors: errors || []
  });
}

async function renderCategoryForm(res, { title, action, old, errors }) {
  return res.status(errors ? 400 : 200).render('w04/category-form', {
    title, action, old, errors: errors || []
  });
}

async function newOrganization(req, res, next) {
  try {
    await renderOrganizationForm(res, { title: 'Add Organization', action: '/organizations', old: {} });
  } catch (error) { next(error); }
}

async function createOrganization(req, res, next) {
  const errors = validationResult(req);
  const old = posted(req, ['name', 'website']);
  try {
    if (!errors.isEmpty()) return await renderOrganizationForm(res, { title: 'Add Organization', action: '/organizations', old, errors: errors.array() });
    await models.createOrganization(old);
    req.flash('success', 'Organization created.');
    res.redirect('/organizations');
  } catch (error) { next(error); }
}

async function editOrganization(req, res, next) {
  try {
    const organization = await models.getOrganizationById(req.params.id);
    if (!organization) return next();
    await renderOrganizationForm(res, { title: 'Edit Organization', action: `/organizations/${organization.id}`, old: organization });
  } catch (error) { next(error); }
}

async function updateOrganization(req, res, next) {
  const errors = validationResult(req);
  const old = { ...posted(req, ['name', 'website']), id: req.params.id };
  try {
    if (!errors.isEmpty()) return await renderOrganizationForm(res, { title: 'Edit Organization', action: `/organizations/${old.id}`, old, errors: errors.array() });
    const organization = await models.updateOrganization(req.params.id, old);
    if (!organization) return next();
    req.flash('success', 'Organization updated.');
    res.redirect('/organizations');
  } catch (error) { next(error); }
}

async function newProject(req, res, next) {
  try {
    await renderProjectForm(res, { title: 'Add Project', action: '/projects', old: { category_ids: [] } });
  } catch (error) { next(error); }
}

async function createProject(req, res, next) {
  const errors = validationResult(req);
  const old = { ...posted(req, ['name', 'description', 'date', 'organization_id']), category_ids: req.body.category_ids || [] };
  try {
    if (!errors.isEmpty()) return await renderProjectForm(res, { title: 'Add Project', action: '/projects', old, errors: errors.array() });
    await models.createProject(old, old.category_ids);
    req.flash('success', 'Project created.');
    res.redirect('/projects');
  } catch (error) { next(error); }
}

async function editProject(req, res, next) {
  try {
    const project = await models.getProjectById(req.params.id);
    if (!project) return next();
    project.date = project.date ? new Date(project.date).toISOString().slice(0, 10) : '';
    project.category_ids = await models.getProjectCategoryIds(project.id);
    await renderProjectForm(res, { title: 'Edit Project', action: `/projects/${project.id}`, old: project });
  } catch (error) { next(error); }
}

async function updateProject(req, res, next) {
  const errors = validationResult(req);
  const old = { ...posted(req, ['name', 'description', 'date', 'organization_id']), id: req.params.id, category_ids: req.body.category_ids || [] };
  try {
    if (!errors.isEmpty()) return await renderProjectForm(res, { title: 'Edit Project', action: `/projects/${old.id}`, old, errors: errors.array() });
    const project = await models.updateProject(old.id, old, old.category_ids);
    if (!project) return next();
    req.flash('success', 'Project updated.');
    res.redirect('/projects');
  } catch (error) { next(error); }
}

async function newCategory(req, res, next) {
  try {
    await renderCategoryForm(res, { title: 'Add Category', action: '/categories', old: {} });
  } catch (error) { next(error); }
}

async function createCategory(req, res, next) {
  const errors = validationResult(req);
  const old = posted(req, ['name']);
  try {
    if (!errors.isEmpty()) return await renderCategoryForm(res, { title: 'Add Category', action: '/categories', old, errors: errors.array() });
    await models.createCategory(old);
    req.flash('success', 'Category created.');
    res.redirect('/categories');
  } catch (error) { next(error); }
}

async function editCategory(req, res, next) {
  try {
    const category = await models.getCategoryById(req.params.id);
    if (!category) return next();
    await renderCategoryForm(res, { title: 'Edit Category', action: `/categories/${category.id}`, old: category });
  } catch (error) { next(error); }
}

async function updateCategory(req, res, next) {
  const errors = validationResult(req);
  const old = { ...posted(req, ['name']), id: req.params.id };
  try {
    if (!errors.isEmpty()) return await renderCategoryForm(res, { title: 'Edit Category', action: `/categories/${old.id}`, old, errors: errors.array() });
    const category = await models.updateCategory(old.id, old);
    if (!category) return next();
    req.flash('success', 'Category updated.');
    res.redirect('/categories');
  } catch (error) { next(error); }
}

module.exports = {
  organizationRules, categoryRules, projectRules, normalizeCategoryIds,
  newOrganization, createOrganization, editOrganization, updateOrganization,
  newProject, createProject, editProject, updateProject,
  newCategory, createCategory, editCategory, updateCategory
};