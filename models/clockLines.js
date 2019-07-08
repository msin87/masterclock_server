const ConfigAPI = require('../API/configAPI.js').ConfigAPI(['clockLines']);
ConfigAPI.init();
module.exports.all = () => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig('clockLines')
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};
module.exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig('clockLines', id)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};
module.exports.push = (newData) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.push('clockLines', newData)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};
module.exports.update = (newData, id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.update('clockLines', newData, id)
            .then(msg => resolve(msg))
            .catch(err => reject(err))
    })
};
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.delete('clockLines', id)
            .then(msg => resolve(msg))
            .catch(err => reject(err))
    })
};
