import {
    AsyncStorage,
    Platform
} from 'react-native'

export default class DataRepository {
    constructor() {
    }

    /**
     * 请求网络数据
     * @param method [string] 请求的方法GET/POST...
     * @param url [string] 请求地址
     * @param params [object]
     * @returns {Promise} [promiseObject]
     */
    fetchNetRepository(method, url, params) {
        let host = Platform.OS === 'ios'
            ? 'https://sc.kongtrolink.com'
            : 'http://sc.kongtrolink.com';
        let URL = host + url;
        if (method === 'GET') {
            return new Promise((resolve, reject) => {
                fetch(URL)
                .then(response => response.json())
                .then(json => {
                    resolve(json);
                })
                .catch(error => {
                    reject(error)
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                fetch(URL, {
                    method: method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(params)
                })
                .then(response => response.json())
                .then(json => {
                    resolve(json);
                })
                .catch(error => {
                    reject(error);
                    console.log(error);
                    alert('获取数据出错')
                })
            })
        }

    }
}