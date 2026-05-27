import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};

export const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await getProjectDetails(id);
        if (!project) return res.status(404).render('404');
        // project already contains categories in model, but ensure shape
        res.render('project', { title: project.name, project });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};
