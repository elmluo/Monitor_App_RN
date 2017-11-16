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
    Alert,
    NativeModules
} from 'react-native'
import Main from './Main'
import Login from './Login'
import ThemeDao from '../expand/dao/ThemeDao'
import JPushModule from 'jpush-react-native';
import DataRepository from '../expand/dao/Data'
import Storage from '../common/StorageClass'
import CompanyPage from './my/CompanyListPage'
import DeviceInfo from 'react-native-device-info'

let storage = new Storage();
let {width, height} = Dimensions.get('window');
let dataRepository = new DataRepository();
let CalendarManager = NativeModules.CalendarManager;
let Updata = NativeModules.UpdateApp;

export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,

        }
    }

    componentDidMount() {
        // SplashScreen.hide();
        // 取本地存储的用户名和密码
        dataRepository.fetchLocalRepository('user')
            .then((userInfo) => {
                storage.setUserInfo(userInfo);
            });
        new ThemeDao().getTheme().then((data) => {
            this.theme = data;
        });

        this._checkNeedUpdate().then((isUpdate) => {
            if (isUpdate === false) {
                return this._checkUser()
            } else {
                // 欢迎页面有关跟新交互代码逻辑
                //进行更新提示
                this._checkoutUpData();
            }
        }).then((isSaved) => {
            isSaved
                ? this._toLogin()
                : this._pushToLoginPage();
        })
    }

    componentWillUnmount() {
        // 组件卸载后取消定时器，防止多余异常出现
        // this.timer && clearTimeout(this.timer);
    }
    //版本更新提示
    _checkoutUpData(){
        Alert.alert(
            '版本更新',
            '检测到新版本，是否立即更新？',
            [
                {text: '退出程序', onPress: () => Platform.OS === 'ios'?CalendarManager.exitApplication():Updata.updateExite()},
                {text: '立即更新', onPress:() => {
                    Platform.OS === 'ios'?(CalendarManager.upDate(),CalendarManager.exitApplication()):Updata.updateDialog(this.state.result.version,this.state.result.url);
                }},
            ],
        { cancelable: false }
        )
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
                    // console.log('获取版本号：' + JSON.stringify(response));
                    //
                    // console.log("App Version", DeviceInfo.getVersion()); // e.g. 1.1.0
                    if (DeviceInfo.getVersion() < response.data.version) {
                        resolve(true);
                    }else {
                        resolve(false);
                    }

                    this.setState({
                        result: response.data
                    })
                })
                .catch((error =>{
                    Alert.alert(
                        '网络错误',
                        '获取数据失败请重试/检测网络状况',
                        [
                            {text: '取消', onPress: () => {}},
                            {text: '重试', onPress:() => {
                                this._checkNeedUpdate();
                            }},
                        ]
                    )
                }))
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
            //进行登录
            // console.log(userData + '登录信息');
            dataRepository.fetchNetRepository('POST', url, params)
                .then((response) => {
                    console.log(response + '登录完成');

                    if (response['success'] === true) {



                        //根据登录返回 classes 判断是代理商还是普通用户
                        if (response.data.classes === '代理商用户') {
                            // alert('代理商');
                            let companyData = {
                                userId: response.data.userId,
                                agencyId: response.data.companyId,
                            }

                            //代理商存储userId与agecyId 以便用户切换企业时使用
                            storage.setCompanyData(companyData);
                            this._pushToCompanyPage(response.data.userId, response.data.companyId);

                        } else {
                            this._JPushSetAlias();
                        }

                    } else {
                        // 显示提示框
                        Alert.alert(
                            response.info,
                            '',
                            [
                                {
                                    text: '确定', onPress: () => {
                                }
                                },
                            ],
                            {cancelable: false}
                        )
                    }

                })
                .catch(error => {
                    console.log(error);
                    alert('获取数据失败');

                })
        });
    }

    /**
     * 登录到企业列表
     * @private
     */
    _pushToCompanyPage(userId, agencyId) {
        this.props.navigator.resetTo({
            component: CompanyPage,
            params: {
                theme: this.theme,
                userId: userId,
                agencyId: agencyId,
                ...this.props
            }
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

    //从缓存中取userId 进行推送注册并跳转主页
    _JPushSetAlias() {

        dataRepository.fetchLocalRepository('/app/v2/user/login').then((userData) => {

            let alias = userData.userId;
            if (alias !== undefined) {
                JPushModule.setAlias(alias, () => {
                    // console.log("Set alias succeed"+ alias);
                }, () => {
                    // console.log("Set alias failed");
                });

            }
            this._pushToMainPage();

        });


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
        let oldVersion;
        dataRepository.fetchLocalRepository('/app/v2/version/get')
            .then((result) => {
                oldVersion = result;
                // alert(JSON.stringify(oldVersion));
            });
        //去拿本地是否有服务器IP 没有则设置默认IP
        dataRepository.fetchLocalRepository('Environment_Domain')
            .then((result) => {
                if (result) {
                    storage.setServerAddress(result);
                } else {
                    storage.setServerAddress('http://sc.kongtrolink.com');
                }
            });
        return (
            <View style={styles.container}>
                <View>
                    <ImageBackground style={{width: width, height: height + 22}}
                                     source={require('../../res/Image/Login/Login_launch.png')}>
                        <Text style={{textAlign: 'center', top: height - 60, color: 'white'}}>检查更新中....</Text>
                    </ImageBackground>
                </View>

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
