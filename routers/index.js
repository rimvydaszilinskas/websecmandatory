const Router = require('express').Router;

const { readdirSync } = require('fs');

module.exports = () => {
    const router = Router();

    // import all the routers from subdirectories
    // all subsequent folders must have index.js file and default export function should return a router and a path
    readdirSync(__dirname, { withFileTypes: true })
        .filter((p) => p.isDirectory())
        .map((p) => p.name)
        .forEach((p) => {
            const pkg = require('./' + p)();
            router.use(pkg.path, pkg.router);
        });

    return router;
};
