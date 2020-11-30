const Router = require('express').Router;
const { body, validationResult } = require('express-validator');

const {
    isAuthenticatedMiddleware,
} = require('../../middleware/authentication');
const { errorArrayToMap } = require('../../utils/errormappers');

module.exports = (dals) => {
    const router = Router();
    const publicRouter = Router();

    router.use(isAuthenticatedMiddleware);

    publicRouter.get('/ping', (req, res) => {
        return res.json({ status: 'ok' });
    });

    router.use('/', publicRouter);

    router
        .route('/posts')
        .get((req, res) => {
            dals.posts
                .getAllPosts()
                .then((posts) => {
                    return res.json(posts);
                })
                .catch((err) => {
                    return res.status(500).json({
                        status: 'internal server error',
                    });
                });
        })
        .post(
            [body('text').isLength({ min: 3 }).exists()],
            (req, res) => {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res
                        .status(400)
                        .json(errorArrayToMap(errors.array()));
                }

                dals.post
                    .createPost(req.body.text, req.session.user)
                    .then((post) => {
                        return res.status(201).json(post);
                    })
                    .catch((err) => {
                        console.error('Error occured: ', err);
                        return res.status(500).json({
                            status: 'internal server error',
                        });
                    });
            },
        );

    router.route('/posts/:id/comments').get((req, res) => {
        dals.posts
            .getPostComments(req.params.id)
            .then((comments) => {
                return res.json(comments);
            })
            .catch((err) => {
                console.error('Error: ', err);
                return res
                    .status(500)
                    .json({ status: 'internal server errror' });
            });
    });

    return {
        router: router,
        path: '/api',
    };
};
