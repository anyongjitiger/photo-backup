import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import GlobalVar from '../utils/global-var.js';
const common_url = GlobalVar.common_url; //服务器地址
/**
 * 使用fetch实现图片上传
 * @param {string} url 接口地址
 * @param {JSON} params body的请求参数
 * @return 返回Promise
 */
function uploadImage(url, params) {
  return new Promise(function (resolve, reject) {
    let formData = new FormData();
    let file = {
      uri: params.uri,
      type: 'multipart/form-data',
      name: params.filename,
    };
    let deviceName = DeviceInfo.getDeviceNameSync();
    formData.append('uploadFile', file);
    formData.append('device', deviceName);
    formData.append('fileName', params.filename);
    formData.append('fileSize', params.fileSize.toString());
    axios
      .post(common_url + url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'x-access-token': token
        },
      })
      .then(function (response) {
        // console.log(response.data);
        resolve(response);
      })
      .catch(function (error) {
        // error
        reject(error);
      })
      .then(function () {
        // always executed
      });
  });
}

function uploadCheck(url, params) {
  return new Promise(function (resolve, reject) {
    let formData = new FormData();
    formData.append('files', JSON.stringify(params));
    axios
      .post(common_url + url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'x-access-token': token
        },
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        // error
        reject(error);
      })
      .then(function () {
        // always executed
      });
  });
}
export { uploadCheck, uploadImage };
