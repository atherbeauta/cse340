const { showOrganizationsPage, showOrganizationDetailsPage } = require('./organizations');
const { showProjectsPage, showProjectDetailsPage } = require('./projects');
const { showCategoriesPage, showCategoryDetailsPage } = require('./categories');
const { testErrorPage } = require('./errors');

module.exports = {
  listOrganizations: showOrganizationsPage,
  showOrganization: showOrganizationDetailsPage,
  listProjects: showProjectsPage,
  showProject: showProjectDetailsPage,
  listCategories: showCategoriesPage,
  showCategory: showCategoryDetailsPage,
  testErrorPage
};