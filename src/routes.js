import express from 'express';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

export default router;
