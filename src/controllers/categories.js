const categoriesModel = require('../models/categories');
const { parseId } = require('./helpers');

async function showCategoriesPage(req, res, next) {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('w03/categories', { title: 'Categories', categories });
  } catch (error) {
    next(error);
  }
}

async function showCategoryDetailsPage(req, res, next) {
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

module.exports = { showCategoriesPage, showCategoryDetailsPage };