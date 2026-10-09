const server = require('./server');

if (require.main === module) server.startServer();

module.exports = server;