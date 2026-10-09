const organizationsModel = require('../models/organizations');
const projectsModel = require('../models/projects');
const { parseId } = require('./helpers');

async function showOrganizationsPage(req, res, next) {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('w03/organizations', { title: 'Organizations', organizations });
  } catch (error) {
    next(error);
  }
}

async function showOrganizationDetailsPage(req, res, next) {
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

module.exports = { showOrganizationsPage, showOrganizationDetailsPage };