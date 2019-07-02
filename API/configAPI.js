const fs = require('fs');
const CONFIGPATH = './config/';
const log = console.log;
const ConfigAPI = (filenames) => {
    this.config = this.config?this.config:{};
    let readFile = (fileName) => {
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
                            if (!this.config[configName]) this.config[configName] = [];
                            this.config[configName][item.id] = item;
                        }
                    }
                    else {
                        this.config[configName] = parsedData;
                    }
                    // fs.stat(fileName,(serr,stats)=>{
                    //     config[configName].lastModified=stats.mtime;
                    //     resolve(config);
                    // })

                    resolve(this.config);
                }
            })
        })
    };
    let writeFile = (filename) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(CONFIGPATH + filename + '.json', JSON.stringify(this.config[filename], null, 2), 'utf8', error => {
                if (error) {
                    log(error);
                    reject(error);
                }
                log(`WRITE FILE: ${filename}.json `);
            });
        })
    };
    return {

        init: () => {
            for (let f of filenames) {
                readFile(CONFIGPATH + f + '.json');
            }
        },
        updateConfig: (configName, configData) => {
            if (configData.hasOwnProperty('id'))
            {
                this.config[configName][configData['id']] = configData;
                log(`CONFIG UPDATE: ${configName} id: ${configData['id']}`);
            }
            else
            {
                this.config[configName] = configData;
                log(`CONFIG UPDATE: ${configName}`);
            }

            return writeFile(configName);

        },
        getConfig: (configName,id) => {
            if (!configName) return this.config;
            if (id) return this.config[configName][Number(id)];
            return this.config[configName];
        },
        eraseConfigElementByID: (configName,id)=>{
            this.config[configName][id]=null;
            return writeFile(configName);
        },

    }
};
module.exports.ConfigAPI = ConfigAPI;