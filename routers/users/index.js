const Router = require('express').Router;
const { body, validationResult } = require('express-validator');

const { errorArrayToMap } = require('../../utils/errormappers');

module.exports = () => {
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

            req.session.loggedin = true;
            req.session.userID = 1;

            res.redirect('/posts');
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
            res.render('register');
        },
    );

    return {
        router: router,
        path: '/users',
    };
};
