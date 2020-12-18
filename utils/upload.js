import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import DeviceInfo from 'react-native-device-info';
const common_url = global.common_url; //服务器地址
let token = ''; //用户登陆后返回的token
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
      uri: params,
      type: 'multipart/form-data',
      name: params.substr(params.lastIndexOf('/') + 1),
    };
    let deviceName = DeviceInfo.getDeviceNameSync(),
      deviceID = DeviceInfo.getDeviceId();
    formData.append('uploadFile', file);
    formData.append('device', deviceName);
    axios
      .post(common_url + url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'x-access-token': token
        },
      })
      .then(function (response) {
        console.log(response.data);
        resolve(response);
      })
      .catch(function (error) {
        // error
        reject(error);
      })
      .then(function () {
        // always executed
      });

    /* RNFetchBlob.fetch(
      'POST',
      common_url + url,
      {
        'Content-Type': 'multipart/form-data',
        // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
        // Or simply wrap the file path with RNFetchBlob.wrap()
      },
      RNFetchBlob.wrap(params),
    )
      .then((res) => {
        console.log(res.text());
      })
      .catch((err) => {
        console.log(err);
        // error handling ..
      }); */

    /* axios
      .get(common_url + 'show//1591239189020239000.jpg', {
        headers: {
          // 'Content-Type': 'multipart/form-data;',
          // 'x-access-token': token,
        },
      })
      .then(function (response) {
        console.log(response);
        resolve(response);
      })
      .catch(function (error) {
        // err
        console.log(error);
        reject(error);
      })
      .then(function () {
        // always executed
      }); */
  });
}

export default uploadImage;
