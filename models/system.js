const ConfigAPI = require('../API/configAPI.js').ConfigAPI(['system']);
ConfigAPI.init();
module.exports.all = () => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig('system')
            .then(data => resolve(data))
            .catch(err => reject(err))

    })
};
module.exports.update = (newData) => {
    return new Promise((resolve, reject) => {
        ConfigAPI.update('system', newData)
            .then(msg => resolve(msg))
            .catch(err => reject(err))
    })
};