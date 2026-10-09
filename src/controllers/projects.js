const projectsModel = require('../models/projects');
const { parseId } = require('./helpers');

const NUMBER_OF_UPCOMING_PROJECTS = 5;

async function showProjectsPage(req, res, next) {
  try {
    const projects = await projectsModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('w03/projects', { title: 'Upcoming Service Projects', projects });
  } catch (error) {
    next(error);
  }
}

async function showProjectDetailsPage(req, res, next) {
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

module.exports = { showProjectsPage, showProjectDetailsPage };