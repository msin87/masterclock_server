const ConfigAPI = require('../API/configAPI.js').ConfigAPI(['schedule']);
ConfigAPI.init();
module.exports.all = () => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig('schedule')
            .then(data => resolve(data))
            .catch(err => reject(err))

    })
};
module.exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig('schedule', id)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};
module.exports.push = (newData) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.push('schedule', newData)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};
module.exports.update = (newData, id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.update('schedule', newData, id)
            .then(msg => resolve(msg))
            .catch(err => reject(err))
    })
};
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.delete('schedule', id)
            .then(msg => resolve(msg))
            .catch(err => reject(err))
    })
};
