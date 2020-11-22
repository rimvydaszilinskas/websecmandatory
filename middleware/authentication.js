module.exports.userMiddleware = (userDal) => {
    // check if user is authenticated and try parsing the user model from the database
    return (req, res, next) => {
        if (req.session.loggedin) {
            userDal
                .getUserByPK(req.session.userID)
                .then((user) => {
                    req.session.user = user;
                    next();
                })
                .catch((err) => {
                    console.error(err);
                    next();
                });
        } else {
            next();
        }
    };
};

module.exports.isAuthenticatedMiddleware = (req, res, next) => {
    // check if user session is authenticated, if not redirect to login page
    if (!req.session.loggedin) {
        return res.redirect('/users/login');
    }

    next();
};

module.exports.isAdminMiddleware = (req, res, next) => {
    if (!req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Invalid permissions' });
    }

    return next();
};
