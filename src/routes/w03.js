const express = require('express');
const controller = require('../controllers/w03');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/organizations'));
router.get('/organizations', controller.listOrganizations);
router.get('/organization/:id', controller.showOrganization);
router.get('/projects', controller.listProjects);
router.get('/project/:id', controller.showProject);
router.get('/categories', controller.listCategories);
router.get('/category/:id', controller.showCategory);

module.exports = router;