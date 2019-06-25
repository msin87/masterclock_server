const fs = require('fs');

const Config = (filenames) => {
    let config = config||{};
    return {
        readFile: (fileName) => {
            return new Promise((resolve, reject) => {
                fs.readFile(fileName, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        let configName = fileName.match(/(?:\.\/config\/)(\w*)/)[1];
                        let parsedData = JSON.parse(data);
                        if (Array.isArray(parsedData)) {
                            for (let item of parsedData) {
                                if (!item) continue;
                                config[configName][item.id] = item;
                            }
                        }
                        else
                        {
                            config[configName]=parsedData;
                        }
                        resolve(config);
                    }
                })
            })
        }
    }
};
module.exports.Config = Config;
