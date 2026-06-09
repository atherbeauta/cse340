const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.listCategories);
router.get('/categories/:id', categoryController.showCategoryDetails);
router.get('/new-category', categoryController.showNewCategoryForm);
router.post('/new-category', categoryController.createCategory);
router.get('/edit-category/:id', categoryController.showEditCategoryForm);
router.post('/edit-category/:id', categoryController.updateCategory);

module.exports = router;
