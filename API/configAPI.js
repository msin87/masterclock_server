const fs = require('fs');
const CONFIGPATH = './config/';
const log = console.log;
const ConfigAPI = (filenames) => {
    this.config = this.config ? this.config : {};
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
                    reject(error);
                }
                resolve(`WRITE FILE: ${filename}.json`);
            });
        })
    };
    let recalcID = (configName) => {
        for (let i = 0; i < this.config[configName].length; i++) {
            this.config[configName][i]['id'] = i;
        }
    }
    return {

        init: () => {
            for (let f of filenames) {
                readFile(CONFIGPATH + f + '.json');
            }
        },
        push: (configName, configData) => {
            return new Promise((resolve, reject) => {
                let resolveMsg = `Data to ${configName} pushed`;
                //make serialize for ID
                if (+configData['id'] !== this.config[configName].length) {
                    resolveMsg = `Data to ${configName} pushed. ID changed: ${configData['id']} => ${this.config[configName].length}`
                    configData['id'] = this.config[configName].length;
                }
                this.config[configName].push(configData);//add data to array
                writeFile(configName)
                    .then(resolve(resolveMsg)
                        .catch(error => {
                                this.config[configName].pop(); //remove added data from this.config[configName]
                                reject(`ERROR: Can't save configuration to file. Reason: \r\n${error}`);
                            }
                        )
                    )
            })
        },
        update: (configName, configData) => {
            return new Promise((resolve, reject) => {
                let resolveMsg = `Data of ${configName} updated.`;
                let backup = this.config[configName];
                if (configData.hasOwnProperty('id')) {
                    if (this.config[configName][configData['id']]) {
                        //prevent ID changing
                        // if (+configData['id'] !== this.config[configName][configData['id']]['id']) {
                        //     resolveMsg += `ID changed: ID=${configData['id']} => `;
                        //     configData['id'] = this.config[configName][configData['id']]['id'];
                        //     resolveMsg += configData['id'];
                        // }
                        this.config[configName][configData['id']] = configData;
                    }
                    else {
                        reject(`Can't find ${configName} element with ID '${configData['id']}'`);
                        return;
                    }
                }
                else {
                    if (this.config[configName]) {
                        this.config[configName] = configData;
                    }
                    else {
                        reject(`Can't find ${configName}`);
                        return;
                    }

                }
                writeFile(configName)
                    .then(resolve(resolveMsg))
                    .catch(error => {
                        this.config[configName] = backup;
                        reject(`ERROR: Can't save configuration to file. Reason: \r\n${error}`);
                    });
            });

        },
        getConfig: (configName, id) => {
            return new Promise((resolve, reject) => {
                if (!configName) {
                    resolve(this.config)
                }
                else {
                    readFile(CONFIGPATH + configName + '.json').then(() => {
                        if (id) {
                            this.config[configName][Number(id)] ?
                                resolve(this.config[configName][Number(id)])
                                : reject(`Can't find ID ${id} of ${configName}`);
                        }
                        else resolve(this.config[configName]);
                    }).catch(err => reject(err))
                }

            })
        },
        eraseConfigElementByID: (configName, id) => {
            return new Promise((resolve, reject) => {
                let backup = this.config[configName];
                this.config[configName].splice(+id, 1);
                recalcID(configName);
                writeFile(configName)
                    .then(resolve(`Data with ID ${id} deleted. All IDs recalculated`))
                    .catch(error => {
                        this.config[configName] = backup;
                        reject(`ERROR: Can't save configuration to file. Reason: \r\n${error}`);
                    });
            })


        },

    }
};
module.exports.ConfigAPI = ConfigAPI;