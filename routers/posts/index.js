const Router = require('express').Router;

module.exports = (dals) => {
    const router = Router();

    router.get('/', (req, res) => {
        res.render('posts');
    });

    return {
        router: router,
        path: '/posts',
    };
};
