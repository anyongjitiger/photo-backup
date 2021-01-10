import { getData } from './global-storage';
const CONFIG = {
    common_url: 'http://192.168.1.201:8000/',
};
getData('common_url').then((_url) => {
    CONFIG.common_url = _url;
});
export default CONFIG;
export function setCommonUrl(url) {
    return new Promise(function (resolve, reject) {
        CONFIG.common_url = "http://" + url + ":8000/";
        resolve(CONFIG.common_url);
    })
}
