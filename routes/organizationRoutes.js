const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

router.get('/organizations', organizationController.listOrganizations);
router.get('/organizations/:id', organizationController.showOrganizationDetails);
router.get('/new-organization', organizationController.showNewOrganizationForm);
router.post('/new-organization', organizationController.createOrganization);
router.get('/edit-organization/:id', organizationController.showEditOrganizationForm);
router.post('/edit-organization/:id', organizationController.updateOrganization);

module.exports = router;
