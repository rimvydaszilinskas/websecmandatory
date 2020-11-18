module.exports = (db) => {
    return {
        getUserByPK: (pk) => {
            db.query(
                'SELECT id, username, first_name, last_name FROM users WHERE id=$1',
                [pk],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return null;
                    }
                    return res.rows[0];
                },
            );
        },
    };
};
