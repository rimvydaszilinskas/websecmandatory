module.exports.sqlPostToObject = (obj) => {
    obj.user = {};

    for (let key in obj) {
        if (key.startsWith('user_')) {
            let newKey = key.replace('user_', '');
            obj.user[newKey] = obj[key];
            delete obj[key];
        }
    }

    return obj;
};
