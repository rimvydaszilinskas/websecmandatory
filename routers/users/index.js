const Router = require('express').Router;
const { body, validationResult } = require('express-validator');

const { errorArrayToMap } = require('../../utils/errormappers');
const {
    hashPassword,
    comparePasswords,
} = require('../../utils/passwords');

module.exports = (dals) => {
    const router = Router();

    router.get('/login', (req, res) => {
        res.render('login', {
            title: 'Login',
        });
    });

    router.post(
        '/login',
        [
            body('username').isLength({ min: 6, max: 30 }),
            body('password').isLength({ min: 6, max: 30 }),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('login', {
                    title: 'Login',
                    errors: errorArrayToMap(errors.array()),
                });
            }

            dals.users
                .getUserByUsernameWithPassword(req.body.username)
                .then((user) => {
                    if (user !== null) {
                        if (
                            comparePasswords(
                                req.body.password,
                                user.password,
                            )
                        ) {
                            req.session.loggedin = true;
                            req.session.userID = user.id;
                            return res.redirect('/posts');
                        }
                    }

                    res.render('login', {
                        title: 'Login',
                        errors: {
                            default: 'Wrong credentials',
                        },
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(500).send();
                });
        },
    );

    router.get('/register', (req, res) => {
        res.render('register', {
            title: 'Register',
        });
    });

    router.post(
        '/register',
        [
            body('username').isLength({ min: 6, max: 30 }),
            body('password').isLength({ min: 6, max: 30 }),
            body('password2').isLength({ min: 6, max: 30 }),
            body('firstName').isLength({ min: 1, max: 30 }),
            body('lastName').isLength({ min: 1, max: 30 }),
            body('email').isLength({ min: 5, max: 50 }).isEmail(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('register', {
                    title: 'Register',
                    errors: errorArrayToMap(errors.array()),
                });
            }

            if (req.body.password !== req.body.password2) {
                return res.render('register', {
                    title: 'Register',
                    errors: {
                        default: {
                            msg: 'Passwords do not match',
                            param: 'default',
                        },
                    },
                });
            }

            dals.users
                .createUser(
                    req.body.username,
                    req.body.email,
                    req.body.firstName,
                    req.body.lastName,
                    hashPassword(req.body.password),
                )
                .then((_) => {
                    res.redirect('/users/login');
                })
                .catch((err) => {
                    console.error(err);
                    res.render('register', {
                        title: 'Register',
                        errors: {
                            default: {
                                msg: err,
                                param: 'default',
                            },
                        },
                    });
                });
        },
    );

    return {
        router: router,
        path: '/users',
    };
};
