const fs = require('fs');
const CONFIGPATH = './config/';
const ConfigAPI = (filenames) => {
        this.config = this.config || {};
        let readFile = (fileName) => {
            return new Promise((resolve, reject) => {
                fs.readFile(fileName, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        let configName = fileName.match(/(?:\.\/config\/)(\w*)/)[1];
                        this.config[configName] = JSON.parse(data);
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
        return {

            init: () => {
                for (let f of filenames) {
                    readFile(CONFIGPATH + f + '.json');
                }
            },
            push: (configName, configData) => {
                return new Promise((resolve, reject) => {
                        let msg = `POST: Data to ${configName} pushed with ID = '${this.config[configName].length}'`;
                        this.config[configName].push(configData);//add data to array
                        writeFile(configName)
                            .then(() => {
                                console.log(msg);
                                resolve(msg);
                            })
                            .catch(error => {
                                    msg = `POST: Error! Can't save configuration to file. Reason: \r\n${error}`;
                                    this.config[configName].pop(); //remove added data from this.config[configName]
                                    console.log(msg);
                                    reject({code: 500, msg});
                                }
                            )
                    }
                )
            },
            update: (configName, configData, id = 0) => {
                return new Promise((resolve, reject) => {
                    let backup = this.config[configName];
                    let msg = `PUT: Error! Can't find ${configName} element with ID '${+id}'`;
                    if (this.config[configName][+id]) {
                        this.config[configName][+id] = configData;
                    }
                    else {
                        reject({code: 404, msg});
                        console.log(msg);
                        return;
                    }
                    writeFile(configName)
                        .then(() => {
                            msg = `PUT: Data of ${configName} updated.`;
                            console.log(msg);
                            resolve(msg)
                        })
                        .catch(error => {
                            this.config[configName] = backup;
                            msg = `PUT: Error! Can't save configuration to file. Reason: \r\n${error}`;
                            console.log(msg);
                            reject({code: 500, msg});
                        });
                });

            },
            readConfig:
                (configName, id) => {
                    return new Promise((resolve, reject) => {
                        let msg = `GET: ${configName} with ID = '${id}'`;
                        if (!configName) {
                            resolve(this.config)
                        }
                        else {
                            readFile(CONFIGPATH + configName + '.json')
                                .then(() => {
                                    if (id) {
                                        //check exist
                                        if (this.config[configName][Number(id)]) {
                                            console.log(msg);
                                            resolve(this.config[configName][Number(id)])
                                        }
                                        else {
                                            msg = `GET: Error! Can't find ${configName} with ID = '${id}'`;
                                            console.log(msg);
                                            reject({code: 404, msg});
                                        }

                                    }
                                    else {
                                        if (this.config[configName]) {
                                            msg = `GET: ${configName}`;
                                            console.log(msg);
                                            resolve(this.config[configName])
                                        }
                                        else {
                                            let msg = `GET: Can't find ${configName}`;
                                            console.log(msg);
                                            reject({code: 404, msg})
                                        }
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    reject({code: 500, err})
                                })
                        }

                    })
                },
            delete:
                (configName, id) => {
                    return new Promise((resolve, reject) => {
                        let backup = this.config[configName];
                        let msg = `DELETE: Data with ID ${id} deleted. All IDs recalculated`;
                        this.config[configName].splice(+id, 1);
                        writeFile(configName)
                            .then(() => {
                                resolve(msg);
                                console.log(msg)
                            })
                            .catch(error => {
                                this.config[configName] = backup;
                                msg = `DELETE: Error! Can't save configuration to file. Reason: \r\n${error}`;
                                console.log(msg);
                                reject({code: 500, msg});
                            });
                    })


                },

        }
    }
;
module.exports.ConfigAPI = ConfigAPI;