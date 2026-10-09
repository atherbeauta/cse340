async function showHomePage(req, res) {
  res.render('w03/home', { title: 'Home' });
}

module.exports = { showHomePage };