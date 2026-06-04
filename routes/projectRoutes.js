const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/projects', projectController.listProjects);
router.get('/new-project', projectController.showNewProjectForm);
router.post('/new-project', projectController.createProject);
router.get('/edit-project/:id', projectController.showEditProjectForm);
router.post('/edit-project/:id', projectController.updateProject);
router.get('/projects/:id', projectController.showProjectDetails);
router.get('/projects/:id/categories', projectController.showAssignCategoriesForm);
router.post('/projects/:id/categories', projectController.assignCategories);

module.exports = router;
