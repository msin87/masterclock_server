const ConfigAPI = require('../API/configAPI.js').ConfigAPI(['clockLines']);
ConfigAPI.init();
module.exports.all = (cb) => {
    cb(ConfigAPI.getConfig('clockLines'));
}
