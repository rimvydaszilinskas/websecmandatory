module.exports.userMiddleware = () => {
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
    if (!req.session.isAuthenticated) {
        return res.redirect('/users/login');
    }

    next();
};
