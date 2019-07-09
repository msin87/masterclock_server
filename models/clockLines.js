const ConfigAPI = require('../API/configAPI.js');
const ClockLines = ConfigAPI('clockLines');
setTimeout(() => {
    ClockLines.delete(2).then(data => console.log(data)).catch(data => console.log(data))
},2000);

let Config = () => {

}
// module.exports.all = () => {
//     return new Promise((resolve, reject) => {
//         ConfigAPI.readConfig('clockLines')
//             .then(data => resolve(data))
//             .catch(err => reject(err))
//     })
// };
// module.exports.findById = (id) => {
//     return new Promise((resolve, reject) => {
//         ConfigAPI.readConfig('clockLines', id)
//             .then(data => resolve(data))
//             .catch(err => reject(err))
//     })
// };
// module.exports.push = (newData) => {
//     return new Promise((resolve, reject) => {
//         ConfigAPI.push('clockLines', newData)
//             .then(data => resolve(data))
//             .catch(err => reject(err))
//     })
// };
// module.exports.update = (newData, id) => {
//     return new Promise((resolve, reject) => {
//         ConfigAPI.update('clockLines', newData, id)
//             .then(msg => resolve(msg))
//             .catch(err => reject(err))
//     })
// };
// module.exports.delete = (id) => {
//     return new Promise((resolve, reject) => {
//         ConfigAPI.delete('clockLines', id)
//             .then(msg => resolve(msg))
//             .catch(err => reject(err))
//     })
// };
