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
                'SELECT posts.id as id, posts.post as post, posts.created_at as created_at, users.id AS user_id, users.first_name AS user_first_name, users.last_name AS user_last_name, users.username AS user_username, users.email AS user_email FROM posts INNER JOIN users ON users.id=posts.user_id',
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

    const deletePostByPK = (pk) =>
        new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM posts WHERE id=?',
                [pk],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                },
            );
        });

    const getCommentByPK = (pk) =>
        new Promise((resolve, reject) => {
            db.query(
                'SELECT comments.id AS id, comments.user_id AS user_id, comments.created_at AS created_at, comments.comment AS comment, users.first_name AS user_name, users.last_name AS user_last_name FROM comments INNER JOIN users ON comments.user_id=users.id WHERE comments.id=?',
                [pk],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(
                        sqlPostToObject(
                            res.length !== 0
                                ? sqlPostToObject(res[0])
                                : null,
                        ),
                    );
                },
            );
        });

    const getPostComments = (pk) =>
        new Promise((resolve, reject) => {
            db.query(
                'SELECT comments.id AS id, comments.user_id AS user_id, comments.created_at AS created_at, comments.comment AS comment, users.first_name AS user_name, users.last_name AS user_last_name FROM comments INNER JOIN users ON comments.user_id=users.id WHERE post_id=?',
                [pk],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    const comments = [];

                    res.forEach((comment) => {
                        comments.push(sqlPostToObject(comment));
                    });

                    resolve(comments);
                },
            );
        });

    const createPostComment = (comment, post, user) =>
        new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
                [post, user, comment],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    return getCommentByPK(res.insertId)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                },
            );
        });

    return {
        getPostByPK: getPostByPK,
        createPost: createPost,
        getAllPosts: getAllPosts,
        deletePostByPK: deletePostByPK,
        getPostByPK: getPostByPK,
        getPostComments: getPostComments,
        createPostComment: createPostComment,
        getCommentByPK: getCommentByPK,
    };
};
