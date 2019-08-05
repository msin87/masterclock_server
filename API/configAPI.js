const fs = require('fs');
const CONFIGPATH = './config/';
const JsonIO = filename => ({
    readJson: () => {
        const jData = JSON.parse(fs.readFileSync(CONFIGPATH + filename + '.json', 'utf8'));
        if (Array.isArray(jData)) {
            return jData;
        }
        else {
            console.log(`JsonIO: Error! The configuration in '${filename}.json' is not an array type!`);
            return 0;
        }
    },
    writeJson: json => {
        return new Promise((resolve, reject) => {
            fs.writeFile(CONFIGPATH + filename + '.json', JSON.stringify(json, null, 2), 'utf8', error => {
                if (error) {
                    reject(error);
                }
                resolve(`JsonIO: Write file ${filename}.json`);
            });
        })
    }
});
const ConfigAPI = (configName) => {
        let jIO = JsonIO(configName),
            config = [];
        config = jIO.readJson();
        if (config === 0) process.exit(1);
        return {
            push: (configData) => {
                return new Promise((resolve, reject) => {
                        let msg = `POST: Data to ${configName} pushed with ID = '${config.length}'`;
                        config.push(configData);//add data to array
                        jIO.writeJson(config)
                            .then(() => {
                                resolve(msg);
                            })
                            .catch(error => {
                                    msg = `POST: Error! Can't save configuration to file. Reason: \r\n${error}`;
                                    config.pop(); //remove added data from config[configName]
                                    reject({code: 500, msg});
                                }
                            )
                    }
                )
            },
            update: (configData, id) => {
                return new Promise((resolve, reject) => {
                    if (!configData) reject(`PUT: Error! Empty object of '${configName}'`);
                    let backup = config;
                    let msg = `PUT: Error! Can't find ${configName} element with ID '${+id}'`;
                    if (id !== undefined) {
                        if (config[+id]) {
                            msg = `PUT: Data of '${configName}' with ID = ${id} updated.`;
                            config[+id] = configData;
                        }
                        else {
                            reject({code: 404, msg});
                            return;
                        }
                    }
                    else {
                        msg = `PUT: All data of '${configName}' updated.`;
                        config = configData;
                    }
                    jIO.writeJson(config)
                        .then(() => {
                            resolve(msg)
                        })
                        .catch(error => {
                            config = backup;
                            msg = `PUT: Error! Can't save configuration to file. Reason: \r\n${error}`;
                            reject({code: 500, msg});
                        });
                });

            },
            all:
                () => {
                    return new Promise(resolve => resolve(config));
                },
            findById: (id = 0) => {
                return new Promise((resolve, reject) => {
                    let msg = `GET: ${configName} with ID = '${id}'`;
                    jIO.readJson()
                        .then((data) => {
                            //check exist
                            if (data[Number(id)]) {
                                resolve(data[Number(id)])
                            }
                            else {
                                msg = `GET: Error! Can't find '${configName}' with ID = '${id}'`;
                                reject({code: 404, msg});
                            }
                        })
                })
            },
            delete:
                (id) => {
                    return new Promise((resolve, reject) => {
                        let backup = config;
                        let msg = `DELETE: Data with ID ${id} deleted. All IDs recalculated`;
                        config.splice(+id, 1);
                        jIO.writeJson(config)
                            .then(() => {
                                resolve(msg);
                            })
                            .catch(error => {
                                config = backup;
                                msg = `DELETE: Error! Can't save configuration to file. Reason: \r\n${error}`;
                                reject({code: 500, msg});
                            });
                    })


                },

        }
    }
;


module.exports = ConfigAPI;