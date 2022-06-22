
// allow proxy requests from the frontend to backend server
const proxy = require('http-proxy-middleware').createProxyMiddleware;


module.exports = function (app) {
    app.use(proxy('/auth/**', { target: 'http://localhost:8888'}));
};