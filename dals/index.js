const userDals = require('./userDals');

// Collect all dals
module.exports = (db) => {
    return {
        users: userDals(db),
    };
};
