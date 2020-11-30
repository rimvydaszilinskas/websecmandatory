const Router = require('express').Router;

const { readdirSync } = require('fs');

module.exports = (dals) => {
    const router = Router();

    router.get('/', (req, res) => res.redirect('/posts'));

    // import all the routers from subdirectories
    // all subsequent folders must have index.js file and default export function should return a router and a path
    readdirSync(__dirname, { withFileTypes: true })
        .filter((p) => p.isDirectory())
        .map((p) => p.name)
        .forEach((p) => {
            const pkg = require('./' + p)(dals);
            router.use(pkg.path, pkg.router);
        });

    return router;
};
