import axios from 'axios';
import {message} from 'antd';
import {navPage} from "./history";

// config axios request
// 生产环境，测试环境和本地环境
const _mapUrl=window.location.host.split(".")[0];
const map=["thd","txx","tcj","thhht","tzs","tly","thz","twh","tmzl","tbt","thlbe"];

// config axios request
// 生产环境，测试环境和本地环境
const Config = {
    proFix: "http://www.uonestem.com/index.php",
    devPrefixOne: "http://my.doubei.com/index.php",
    localRequestUrl:"http://114.55.89.35:8081/index.php",
    devPrefixTwo:"http://114.55.89.35:8081/index.php"
};

let href=window.location.href;

axios.defaults.baseURL = Config.proFix;

// my doubei test
if(href.indexOf("my")>=0){
    axios.defaults.baseURL = Config.devPrefixOne;
};


// 公办
if(map.indexOf(_mapUrl)>=0){
    axios.defaults.baseURL="http://api.uonestem.com/index.php";
}

// 民办
if(href.indexOf("teacher")>=0){
    axios.defaults.baseURL="http://www.uonestem.com/index.php";
}

// 本地test
if(href.indexOf("localhost")>=0){
    axios.defaults.baseURL = Config.localRequestUrl;
}

// 民办test环境地址配置
if (href.indexOf("114.55.89.35:8082")>=0){
    axios.defaults.baseURL = Config.devPrefixTwo;
}
        

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    method: 'post',
    url: '',
    data: {
        token: ''
    }
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export const $axios = (url, params = {}, method = 'POST') => {
    config.method = method;
    config.url = url;
    config.data = {
        token: localStorage.getItem('token'),
        ...params
    };
    return axios(config)
        .then(checkStatus)
        .then(response => {
            switch (response.data.ret_code + '') {
                case '1005':
                    if(window.location.href.indexOf("localhost")>=0)return;
                    message.error(response.data.ret_msg);
                    navPage('/login');
                    localStorage.clear();
                    break;
                case '0000000':
                case '6003':
                case '1003':
                case '1012':
                    return response.data;
                default:
                    if(url.indexOf("teacher_pay_status")>=0)break;
                    message.error(response.data.ret_msg);
                    break;
            }
        })
        .catch(err => {
            message.error(err.message);
        });
};