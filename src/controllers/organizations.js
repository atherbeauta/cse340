import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId } from '../models/organizations.js';

export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};

export const showOrganizationDetailsPage = async (req, res) => {
    const id = req.params.id;
    try {
        const organization = await getOrganizationById(id);
        if (!organization) return res.status(404).render('404');
        const projects = await getProjectsByOrganizationId(id);
        res.render('organization', { title: organization.name, organization, projects });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};
