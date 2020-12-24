const CONFIG = {
    common_url: 'http://192.168.3.133:8000/',
};
export default CONFIG;
export function setCommonUrl(url) {
    CONFIG.common_url = `http://&{url}:8000/`;
}
