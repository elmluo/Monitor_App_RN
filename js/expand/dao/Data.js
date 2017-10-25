import {
    AsyncStorage,
    Platform
} from 'react-native'
import Storage from '../../common/StorageClass'
let storage = new Storage();
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
        // let host = Platform.OS === 'ios'
        //     ? 'http://sc.kongtrolink.com'      // 在Info.plist中的App Transport Security Settings中添加Allow Arbitrary Loads，类型为Boolean，值为yes。可以用http请求，但是不能用https请求
        //     : 'http://sc.kongtrolink.com';
        let host = storage.getServerIP()?storage.getServerIP():'http://sc.kongtrolink.com';

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

    /**
     * 保存至本地
     * @param url
     * @param value
     * @returns {*}
     */
    saveRepository(url, value) {
        if (!value || !url ) return;
        return new Promise((resolve, reject)=>{
            AsyncStorage.setItem(url, JSON.stringify(value), (error)=>{
                if (!error) {
                    resolve();
                } else {
                    reject(error)
                }
            });
        })

    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocal(url) {
        AsyncStorage.getItem(url, (error, result)=> {
            if (!error) {
                return result
            } else {
                return error
            }
        })
    }

    removeLocalRepository(url) {
        if (!url ) return;
        return new Promise((resolve, reject)=>{
            AsyncStorage.removeItem(url, (error)=>{
                if (!error) {
                    resolve();
                    console.log('success')
                } else {
                    console.log('failure');
                    reject(error)
                }
            });
        })
    }
}