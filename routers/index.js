const Router = require('express').Router;

const { readdirSync } = require('fs');

module.exports = () => {
    const router = Router();

    // import all the routers from subdirectories
    readdirSync(__dirname, { withFileTypes: true })
        .filter((p) => p.isDirectory())
        .map((p) => p.name)
        .forEach((p) => {
            const pkg = require('./' + p)();
            router.use(pkg.path, pkg.router);
        });

    return router;
};
