module.exports = (Config) => {
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                Config.all()
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },
        findById: (id = 0) => {
            return new Promise((resolve, reject) => {
                Config.findById(id)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },
        push: (newData) => {
            return new Promise((resolve, reject) => {
                Config.push(newData)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },
        update: (newData, id) => {
            return new Promise((resolve, reject) => {
                Config.update(newData, id)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err))
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                Config.delete(id)
                    .then(msg => resolve(msg))
                    .catch(err => reject(err))
            })

        }
    }
};