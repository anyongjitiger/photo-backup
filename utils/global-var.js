const CONFIG = {
    common_url: 'http://10.0.2.2:8000/',
};
export default CONFIG;
export function setCommonUrl(url) {
    return new Promise(function (resolve, reject) {
        CONFIG.common_url = "http://" + url + ":8000/";
        resolve(CONFIG.common_url);
    })
}
