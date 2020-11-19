module.exports.userMiddleware = () => {
    // check if user is authenticated and try parsing the user model from the database
    return (req, res, next) => {
        if (req.session.isAuthenticated) {
            req.session.user = {
                id: req.session.userID,
            };
        }

        next();
    };
};

module.exports.isAuthenticatedMiddleware = (req, res, next) => {
    // check if user session is authenticated, if not redirect to login page
    if (!req.session.isAuthenticated) {
        return res.redirect('/users/login');
    }

    next();
};
