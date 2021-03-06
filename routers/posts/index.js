const Router = require('express').Router;
const { body, validationResult } = require('express-validator');

const {
    isAuthenticatedMiddleware,
    isAdminMiddleware,
} = require('../../middleware/authentication');
const { errorArrayToMap } = require('../../utils/errormappers');

module.exports = (dals) => {
    const router = Router();
    router.use(isAuthenticatedMiddleware);

    router.get('/', (req, res) => {
        dals.posts
            .getAllPosts()
            .then((posts) => {
                return res.render('posts', {
                    title: 'Posts',
                    posts: posts,
                    user: req.session.user,
                });
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    });

    router.post(
        '/',
        [body('text').isLength({ min: 3 }).exists()],
        (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(errorArrayToMap(errors.array()));
            }

            dals.posts
                .createPost(req.body.text, req.session.user)
                .then((post) => {
                    return res.render('new_post', {
                        title: `New post ${post.id}`,
                        post: post,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({
                        error: 'internal server error',
                    });
                });
        },
    );

    router.get('/:id', (req, res) => {
        dals.posts
            .getPostByPK(req.params.id)
            .then((post) => {
                dals.posts
                    .getPostComments(post.id)
                    .then((comments) => {
                        return res.render('new_post', {
                            title: `Post ${post.id}`,
                            post: post,
                            comments: comments,
                        });
                    })
                    .catch((err) => {
                        console.error('Error: ', err);
                        return res.status(500).json({
                            error: 'internal server error',
                        });
                    });
            })
            .catch((err) => {
                console.error('Error: ', err);
                res.status(500).json({
                    error: 'internal server error',
                });
            });
    });

    router.get('/:id/delete', isAdminMiddleware, (req, res) => {
        dals.posts.deletePostByPK(req.params.id).then((result) => {
            if (result.affectedRows !== 0) {
                return res.redirect('/posts/');
            }

            return res
                .status(404)
                .json({ error: 'Cannot find the post' });
        });
    });

    router.post(
        '/:id/comments',
        [body('text').isLength({ min: 3 }).exists()],
        (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(errorArrayToMap(errors.array()));
            }

            dals.posts
                .getPostByPK(req.params.id)
                .then((post) => {
                    if (post === null) {
                        return res
                            .status(404)
                            .json({ detail: 'Post not found' });
                    }

                    dals.posts
                        .createPostComment(
                            req.body.text,
                            post.id,
                            req.session.user.id,
                        )
                        .then((_) => {
                            return res.redirect(`/posts/${post.id}`);
                        })
                        .catch((err) => {
                            return res.status(500).json(err);
                        });
                })
                .catch((err) => {
                    return res.status(500).json(err);
                });
        },
    );

    return {
        router: router,
        path: '/posts',
    };
};
