const ConfigAPI = require('../API/configAPI.js').ConfigAPI(['clockLines', 'system', 'schedule']);
module.exports.all = () => {
    return new Promise((resolve, reject) => {
        ConfigAPI.readConfig()
            .then(data => resolve(data))
            .catch(err => reject(err))

    })
};