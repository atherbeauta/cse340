const models = require('../models/w03');

function parseId(value) {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function listOrganizations(req, res, next) {
  try {
    const organizations = await models.getAllOrganizations();
    res.render('w03/organizations', { title: 'Organizations', organizations });
  } catch (error) {
    next(error);
  }
}

async function showOrganization(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const organization = id && await models.getOrganizationById(id);
    if (!organization) return next();
    const projects = await models.getProjectsByOrganization(id);
    res.render('w03/organization', { title: organization.name, organization, projects });
  } catch (error) {
    next(error);
  }
}

async function listProjects(req, res, next) {
  try {
    const projects = await models.getAllProjects();
    res.render('w03/projects', { title: 'Projects', projects });
  } catch (error) {
    next(error);
  }
}

async function showProject(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const project = id && await models.getProjectById(id);
    if (!project) return next();
    const categories = await models.getCategoriesByProject(id);
    res.render('w03/project', { title: project.name, project, categories });
  } catch (error) {
    next(error);
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await models.getAllCategories();
    res.render('w03/categories', { title: 'Categories', categories });
  } catch (error) {
    next(error);
  }
}

async function showCategory(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const category = id && await models.getCategoryById(id);
    if (!category) return next();
    const projects = await models.getProjectsByCategory(id);
    res.render('w03/category', { title: category.name, category, projects });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrganizations,
  showOrganization,
  listProjects,
  showProject,
  listCategories,
  showCategory
};