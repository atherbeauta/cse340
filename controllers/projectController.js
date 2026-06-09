const { body, validationResult } = require('express-validator');
const projectModel = require('../models/projectModel');
const organizationModel = require('../models/organizationModel');
const categoryModel = require('../models/categoryModel');

exports.listProjects = async (req, res) => {
  try {
    const projects = await projectModel.getAllProjects();
    res.render('projects/list', { projects });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.showNewProjectForm = async (req, res) => {
  try {
    const organizations = await organizationModel.getAllOrganizations();
    res.render('projects/new', { errors: [], old: {}, organizations });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.createProject = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description').trim().isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
  body('date').notEmpty().withMessage('Service date is required'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name, description, date, organization_id } = req.body;
    const organizations = await organizationModel.getAllOrganizations();
    if (!errors.isEmpty()) {
      return res.status(422).render('projects/new', { errors: errors.array(), old: { name, description, date, organization_id }, organizations });
    }
    try {
      await projectModel.createProject(name, description, date, organization_id);
      req.flash('success', 'Project created');
      res.redirect('/projects');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];

exports.showEditProjectForm = async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    const organizations = await organizationModel.getAllOrganizations();
    res.render('projects/edit', { errors: [], old: project, organizations });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.updateProject = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description').trim().isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
  body('date').notEmpty().withMessage('Service date is required'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name, description, date, organization_id } = req.body;
    const id = req.params.id;
    const organizations = await organizationModel.getAllOrganizations();
    if (!errors.isEmpty()) {
      return res.status(422).render('projects/edit', { errors: errors.array(), old: { id, name, description, date, organization_id }, organizations });
    }
    try {
      await projectModel.updateProject(id, name, description, date, organization_id);
      req.flash('success', 'Project updated');
      res.redirect('/projects');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];

exports.showProjectDetails = async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    const categoryIds = await projectModel.getProjectCategoryIds(req.params.id);
    const categories = await categoryModel.getAllCategories();
    const assignedCategories = categories.filter(category => categoryIds.includes(category.id));
    res.render('projects/detail', { project, assignedCategories });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.showAssignCategoriesForm = async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    const categories = await categoryModel.getAllCategories();
    const selectedIds = await projectModel.getProjectCategoryIds(req.params.id);
    res.render('projects/assignCategories', { project, categories, selectedIds });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.assignCategories = async (req, res) => {
  try {
    const categoryIds = Array.isArray(req.body.category_ids)
      ? req.body.category_ids
      : req.body.category_ids
      ? [req.body.category_ids]
      : [];
    await projectModel.setProjectCategories(req.params.id, categoryIds);
    req.flash('success', 'Categories updated');
    res.redirect(`/projects/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Database error');
  }
};
