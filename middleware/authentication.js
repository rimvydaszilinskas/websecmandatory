module.exports.userMiddleware = (userDal) => {
    // check if user is authenticated and try parsing the user model from the database
    return (req, res, next) => {
        if (req.session.isAuthenticated) {
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
    if (!req.session.isAuthenticated) {
        return res.redirect('/users/login');
    }

    next();
};
