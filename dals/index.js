const userDals = require('./userDals');
const postDals = require('./postDals');

// Collect all dals
module.exports = (db) => {
    return {
        users: userDals(db),
        posts: postDals(db),
    };
};
