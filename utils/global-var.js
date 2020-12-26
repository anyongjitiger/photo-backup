const CONFIG = {
    common_url: 'http://192.168.1.76:8000/',
};
export default CONFIG;
export function setCommonUrl(url) {
    return new Promise(function (resolve, reject) {
        CONFIG.common_url = "http://" + url + ":8000/";
        console.log(CONFIG.common_url);
        resolve(CONFIG.common_url);
    })
}
