const { body, validationResult } = require('express-validator');
const categoryModel = require('../models/categoryModel');

exports.showNewCategoryForm = async (req, res) => {
  res.render('categories/new', { errors: [], old: {} });
};

exports.createCategory = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name } = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).render('categories/new', { errors: errors.array(), old: { name } });
    }
    try {
      await categoryModel.createCategory(name);
      req.flash && req.flash('success', 'Category created');
      res.redirect('/categories');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];

exports.showEditCategoryForm = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    res.render('categories/edit', { errors: [], old: category });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.updateCategory = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    const { name } = req.body;
    const id = req.params.id;
    if (!errors.isEmpty()) {
      return res.status(422).render('categories/edit', { errors: errors.array(), old: { id, name } });
    }
    try {
      const changes = await categoryModel.updateCategory(id, name);
      req.flash && req.flash('success', 'Category updated');
      res.redirect('/categories');
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
];

exports.showCategoryDetails = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    res.render('categories/detail', { category });
  } catch (err) {
    res.status(500).send('Database error');
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render('categories/list', { categories });
  } catch (err) {
    res.status(500).send('Database error');
  }
};
