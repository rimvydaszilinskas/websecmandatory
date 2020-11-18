module.exports.errorArrayToMap = (arr) => {
    let data = {};
    arr.forEach((item) => {
        data[item.param] = {
            value: item.value,
            msg: item.msg,
        };
    });
    return data;
};
