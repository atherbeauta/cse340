const { body, validationResult } = require('express-validator');
const organizationModel = require('../models/organizationModel');

exports.listOrganizations = async (req, res) => {
  try {
    const organizations = await organizationModel.getAllOrganizations();
    res.render('organizations/list', { organizations });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.showNewOrganizationForm = (req, res) => {
  res.render('organizations/new', { errors: [], old: {} });
};

exports.createOrganization = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name } = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).render('organizations/new', { errors: errors.array(), old: { name } });
    }
    try {
      await organizationModel.createOrganization(name);
      req.flash('success', 'Organization created');
      res.redirect('/organizations');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];

exports.showEditOrganizationForm = async (req, res) => {
  try {
    const organization = await organizationModel.getOrganizationById(req.params.id);
    if (!organization) return res.status(404).send('Organization not found');
    res.render('organizations/edit', { errors: [], old: organization });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.showOrganizationDetails = async (req, res) => {
  try {
    const organization = await organizationModel.getOrganizationById(req.params.id);
    if (!organization) return res.status(404).send('Organization not found');
    res.render('organizations/detail', { organization });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.updateOrganization = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name } = req.body;
    const id = req.params.id;
    if (!errors.isEmpty()) {
      return res.status(422).render('organizations/edit', { errors: errors.array(), old: { id, name } });
    }
    try {
      await organizationModel.updateOrganization(id, name);
      req.flash('success', 'Organization updated');
      res.redirect('/organizations');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];
