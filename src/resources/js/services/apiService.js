import axios from "axios";
import CryptoJS from 'crypto-js';

let apiKey = process.env.REACT_APP_BINANCE_TEST_API_KEY;
let secretKey = process.env.REACT_APP_BINANCE_TEST_SECRET_API_KEY;
let baseUrl = process.env.REACT_APP_TEST_URL;
if (!process.env.REACT_APP_TEST) {
    apiKey = process.env.REACT_APP_BINANCE_API_KEY;
    baseUrl = process.env.REACT_APP_BASE_URL;
    secretKey = process.env.REACT_APP_BINANCE_SECRET_API_KEY;
}
axios.defaults.baseURL = baseUrl;

console.log(process.env);

axios.interceptors.request.use(
    function (config) {

        config.headers['X-MBX-APIKEY'] = apiKey;
        config.headers['Accept'] = '*/*';
        config.headers['Content-Type'] = 'application/json';
        // config.headers['Access-Control-Allow-Origin'] = '*';
        

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

const createCaller = ((myAxios) => {
    let method, call;
    call = (url, params, callMethod) => new Promise((resolve, reject) => {
        method = callMethod || method;

        myAxios({
            method,
            url,
            ...params
        }).then(res => {
            resolve(res.data);
        }, err => {
            reject(err);
        })

    });

    return {
        get: (url, params) => call(url, { params }, 'get'),
        post: (url, params) => call(url, { data: params }, 'post'),
        put: (url, params) => call(url, { data: params }, 'put'),
        delete: (url, params) => call(url, { data: params }, 'delete'),
        option: (url, _method, params) => {
            method = _method;
            return call(url, method === 'post' ? params : { params }, true);
        }
    }
});

export const myAxios = createCaller(axios);

export const createSignature = (queryString) => CryptoJS.HmacSHA256(queryString, secretKey).toString(CryptoJS.enc.Hex);

export const getTimeStamp = () => myAxios.get("/fapi/v1/time").then((res) => {
    return res?.serverTime;
});
