import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};

export const showCategoryDetailsPage = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await getCategoryById(id);
        if (!category) return res.status(404).render('404');
        const projects = await getProjectsByCategoryId(id);
        res.render('category', { title: `Category: ${category.name}`, category, projects });
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
};
