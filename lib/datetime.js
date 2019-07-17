module.exports = {
    getTime: (unixTime) => {
        let date = new Date(unixTime);
        let hours = ('0' + date.getHours()).substr(-2);
        let minutes = ('0' + date.getMinutes()).substr(-2);
        return (hours + ':' + minutes);
    }
}