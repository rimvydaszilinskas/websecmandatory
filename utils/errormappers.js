module.exports.errorArrayToMap = (arr) => {
    // express-validation returns errors as a array
    // this is a utility function that helps convert that array to map
    let data = {};
    arr.forEach((item) => {
        data[item.param] = {
            param: item.param,
            value: item.value,
            msg: item.msg,
        };
    });
    return data;
};
