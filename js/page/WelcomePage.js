/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    ImageBackground,
    Dimensions,
} from 'react-native'
import Main from './Main'
import Login from './Login'
import ThemeDao from '../expand/dao/ThemeDao'
import JPushModule from 'jpush-react-native';
import DataRepository from '../expand/dao/Data'
import Storage from '../../common/StorageClass'

let StorageClass = new Storage();
let {width, height} = Dimensions.get('window');
let dataRepository = new DataRepository();
export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,

        }
    }

    componentDidMount() {
        // SplashScreen.hide();
        new ThemeDao().getTheme().then((data) => {
            this.theme = data;
        });
        // this.timer=setTimeout(()=> {
        //     // SplashScreen.hide();
        //     this.props.navigator.resetTo({
        //         component: Login,
        //         params:{
        //             theme:this.theme,
        //             ...this.props
        //         }
        //     });
        // }, 1000);

        this._checkNeedUpdate().then((isUpdate) => {
            if (isUpdate === false) {
                return this._checkUser()
            } else {
                // 欢迎页面有关跟新交互代码逻辑
            }
        }).then((isSaved) => {
            isSaved
                ? this._toLogin()
                // ? this._pushToLoginPage()
                : this._pushToLoginPage();
        })
    }

    componentWillUnmount() {
        // 组件卸载后取消定时器，防止多余异常出现
        // this.timer && clearTimeout(this.timer);
    }

    /**
     * 验证app是否需要跟新
     * @returns {Promise}
     * @private
     */
    _checkNeedUpdate() {
        let url = '/app/v2/version/get';
        let params = {
            appId: 'YiYi',
            os: Platform.OS,
        };
        return new Promise((resolve, reject) => {
            dataRepository.fetchNetRepository('POST', url, params)
                .then(response => {
                    dataRepository.fetchLocalRepository(url).then((localData) => {
                        console.log(localData);
                        console.log(response.data);
                        if (localData) {
                            // 若之前登陆过，比较、跟新本地版本信息
                            if (response.data.version === localData.version) {
                                resolve(false);
                            } else {
                                dataRepository.saveRepository(url, response.data)
                                    .then((error) => {
                                        reject(error);
                                    });
                            }
                        } else {
                            // 若首次打开，保存版本信息,进入登陆页面
                            dataRepository.saveRepository(url, response.data)
                                .then((error) => {
                                    resolve(false);
                                });
                        }


                    })
                        .catch(error => {
                            reject(error)
                        });

                    this.setState({
                        result: response
                    })
                })
        });
    }

    /**
     * 验证用户是否已经登录
     * @returns {Promise}
     * @private
     */
    _checkUser() {
        return new Promise((resolve, reject) => {
            dataRepository.fetchLocalRepository('user')
                .then((userData) => {
                    // console.log(userData, '获取本地用户信息');
                    if (userData) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    /**
     * 用户已经登录，获取本地用户信息，发送登录操作, 保存登录信息到单例
     * @private
     */

    _toLogin() {
        dataRepository.fetchLocalRepository('user').then((userData) => {
            let url = '/app/v2/user/login';
            let params = {
                appId: 'YiYi',
                username: userData.username,
                password: userData.password
            };
            dataRepository.fetchNetRepository('POST', url, params)
                .then((response) => {
                    if (response['success'] === true) {
                        this._JPushSetAliasAndTag();
                        // this._pushToMainPage();

                    } else {
                        console.log('response.info')
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        });
    }

    _pushToMainPage() {
        this.props.navigator.resetTo({
            component: Main,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }


    _JPushSetAliasAndTag() {

        let alias = StorageClass.userId;

        JPushModule.setAlias()
        {
            if (alias !== undefined) {
                JPushModule.setAlias(alias, () => {
                    console.log("Set alias succeed");
                }, () => {
                    console.log("Set alias failed");
                });
            }
        }
        this._pushToMainPage();


    }

    _pushToLoginPage() {

        this.props.navigator.resetTo({
            component: Login,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }

    render() {
        // return null;
        let newVersion = JSON.stringify(this.state.result);
        let oldVersion;
        dataRepository.fetchLocalRepository('/app/v2/version/get')
            .then((result) => {
                oldVersion = result;
                // alert(JSON.stringify(oldVersion));
            });
        return (
            <View style={styles.container}>
                <View>
                    <ImageBackground style={{width: width, height: height + 22}}
                                     source={require('../../res/Image/Login/Login_launch.png')}>
                        <Text style={{textAlign: 'center', top: height - 60, color: 'white'}}>检查更新中....</Text>
                    </ImageBackground>
                </View>

                <Text>{this.state.result}</Text>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tips: {
        fontSize: 29
    }
})
