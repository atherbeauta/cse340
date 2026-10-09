const organizationsModel = require('../models/organizations');
const projectsModel = require('../models/projects');
const categoriesModel = require('../models/categories');

function parseId(value) {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function listOrganizations(req, res, next) {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('w03/organizations', { title: 'Organizations', organizations });
  } catch (error) {
    next(error);
  }
}

async function showOrganization(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const organization = id && await organizationsModel.getOrganizationById(id);
    if (!organization) return next();
    const projects = await projectsModel.getProjectsByOrganization(id);
    res.render('w03/organization', { title: organization.name, organization, projects });
  } catch (error) {
    next(error);
  }
}

async function listProjects(req, res, next) {
  try {
    const projects = await projectsModel.getAllProjects();
    res.render('w03/projects', { title: 'Projects', projects });
  } catch (error) {
    next(error);
  }
}

async function showProject(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const project = id && await projectsModel.getProjectById(id);
    if (!project) return next();
    const categories = await projectsModel.getCategoriesByProject(id);
    res.render('w03/project', { title: project.name, project, categories });
  } catch (error) {
    next(error);
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('w03/categories', { title: 'Categories', categories });
  } catch (error) {
    next(error);
  }
}

async function showCategory(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const category = id && await categoriesModel.getCategoryById(id);
    if (!category) return next();
    const projects = await categoriesModel.getProjectsByCategory(id);
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