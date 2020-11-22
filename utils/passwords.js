const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

module.exports.comparePasswords = (raw, hashed) => {
    return bcrypt.compareSync(raw, hashed);
};
