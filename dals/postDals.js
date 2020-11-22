const { sqlPostToObject } = require('../utils/objectBuilders');

module.exports = (db) => {
    const getPostByPK = (pk) =>
        new Promise((resolve, reject) => {
            db.query(
                'SELECT posts.id as id, posts.post as post, posts.created_at as created_at, users.id AS user_id, users.first_name AS user_first, users.last_name AS user_last, users.username AS user_username, users.email AS user_email FROM posts INNER JOIN users ON users.id=posts.user_id WHERE posts.id=?',
                [pk],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(
                        res.length !== 0
                            ? sqlPostToObject(res[0])
                            : null,
                    );
                },
            );
        });

    const createPost = (post, user) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO posts (post, user_id) VALUES (?, ?)',
                [post, user.id],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    return getPostByPK(res.insertId)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                },
            );
        });
    };

    const getAllPosts = () =>
        new Promise((resolve, reject) => {
            db.query(
                'SELECT posts.id as id, posts.post as post, posts.created_at as created_at, users.id AS user_id, users.first_name AS user_first, users.last_name AS user_last, users.username AS user_username, users.email AS user_email FROM posts INNER JOIN users ON users.id=posts.user_id',
                [],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    const posts = [];

                    res.forEach((post) => {
                        posts.push(sqlPostToObject(post));
                    });

                    return resolve(posts);
                },
            );
        });

    return {
        getPostByPK: getPostByPK,
        createPost: createPost,
        getAllPosts: getAllPosts,
    };
};
