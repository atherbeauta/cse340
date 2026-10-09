const express = require('express');
const controller = require('../controllers/w04');

const router = express.Router();

router.get('/organizations/new', controller.newOrganization);
router.post('/organizations', controller.organizationRules, controller.createOrganization);
router.get('/organizations/:id/edit', controller.editOrganization);
router.post('/organizations/:id', controller.organizationRules, controller.updateOrganization);

router.get('/projects/new', controller.newProject);
router.post('/projects', controller.normalizeCategoryIds, controller.projectRules, controller.createProject);
router.get('/projects/:id/edit', controller.editProject);
router.post('/projects/:id', controller.normalizeCategoryIds, controller.projectRules, controller.updateProject);

router.get('/categories/new', controller.newCategory);
router.post('/categories', controller.categoryRules, controller.createCategory);
router.get('/categories/:id/edit', controller.editCategory);
router.post('/categories/:id', controller.categoryRules, controller.updateCategory);

module.exports = router;