import axios from 'axios';
import { showMessage } from "react-native-flash-message";
axios.defaults.timeout = 100000;
axios.defaults.retry = 3;
axios.defaults.retryDelay = 2000;
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.message.includes('timeout')) {   // 判断请求异常信息中是否含有超时timeout字符串
            showMessage({
                message: "服务器连接失败！",
                type: "warning",
            });
            return Promise.reject(error);          // reject这个错误信息
        }
        if (error.response && error.response.status === 401) {
            showMessage({
                message: "未登录，或登录超时！",
                type: "warning",
            });
            return Promise.reject(error)
        }
        return Promise.reject(error);
    });