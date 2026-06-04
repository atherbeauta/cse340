document.addEventListener('DOMContentLoaded', function () {
  function attach(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      const name = form.querySelector('#name').value.trim();
      if (!name) {
        e.preventDefault();
        alert('Name is required');
        return;
      }
      if (name.length > 100) {
        e.preventDefault();
        alert('Name must be at most 100 characters');
        return;
      }
      // intentionally no minlength client-side (server tests min length)
    });
  }
  attach('newCategoryForm');
  attach('editCategoryForm');
  attach('newOrganizationForm');
  attach('editOrganizationForm');
  attach('newProjectForm');
  attach('editProjectForm');
});
