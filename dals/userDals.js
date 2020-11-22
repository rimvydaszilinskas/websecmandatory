module.exports = (db) => {
    const getUserByPK = (pk) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, isAdmin FROM users WHERE id=? LIMIT 1',
                [pk],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const getUserByEmailOrUsername = (input) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, isAdmin FROM users WHERE username=? OR email=? LIMIT 1',
                [input, input],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const checkIfUserExists = (email, username) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, isAdmin FROM users WHERE username=? OR email=? LIMIT 1',
                [username, email],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const getUserByEmail = (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, isAdmin FROM users WHERE email=? LIMIT 1',
                [email],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const getUserByEmailWithPassword = (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, password, isAdmin FROM users WHERE email=? LIMIT 1',
                [email],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const getUserByUsernameWithPassword = (username) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, username, email, first_name, last_name, password, isAdmin FROM users WHERE username=? LIMIT 1',
                [username],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res.length !== 0 ? res[0] : null);
                },
            );
        });
    };

    const createUser = (
        username,
        email,
        firstName,
        lastName,
        password,
    ) => {
        return new Promise((resolve, reject) => {
            checkIfUserExists(email, username)
                .then((user) => {
                    if (user !== null) {
                        return reject('User already exists');
                    }

                    db.query(
                        'INSERT INTO users(username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)',
                        [
                            username,
                            email,
                            firstName,
                            lastName,
                            password,
                        ],
                        (err, res) => {
                            if (err) {
                                return reject(err);
                            }
                            return getUserByPK(res.insertId)
                                .then((res) => resolve(res))
                                .catch((err) => reject(err));
                        },
                    );
                })
                .catch((err) => {
                    console.error(err);
                    return reject(err);
                });
        });
    };

    return {
        getUserByPK: getUserByPK,
        getUserByEmail: getUserByEmail,
        getUserByEmailWithPassword: getUserByEmailWithPassword,
        getUserByUsernameWithPassword: getUserByUsernameWithPassword,
        createUser: createUser,
        getUserByEmailOrUsername: getUserByEmailOrUsername,
    };
};
