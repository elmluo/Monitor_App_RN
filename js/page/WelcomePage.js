/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import Main from './Main'
import Login from './Login'
import LoginDemo from './LoginDemo'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'
import SearchPage from "./SearchPage";
import DataRepository from '../expand/dao/Data'
let dataRepository  = new DataRepository();
export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
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

        this._checkVersion()
    }
    componentWillUnmount(){
        // 组件卸载后取消定时器，防止多余异常出现
        this.timer && clearTimeout(this.timer);
    }

    /**
     * 获取软件版本信息
     * @returns {XML}
     */
    _checkVersion() {
        let url='/app/v2/version/get';
        let params = {
            appId: 'YiYi',
            os: Platform.OS,
        };
        dataRepository.fetchNetRepository('POST', url, params)
            .then(result=>{
                alert(JSON.stringify(result));
                dataRepository.fetchLocalRepository(url)
                    .then((localData)=> {
                        // alert(JSON.stringify(localData));
                        // 根据是否需要跟新执行不同逻辑
                        if (result.data.version === localData.value.version){
                            alert('版本相同不用跟新');
                            this._pushToLogin();
                            // this._pushToMain()
                        } else {
                            // 跟新本地数据
                            dataRepository.saveRepository(url, result.data, (error)=> {
                                console.log(error)
                            });
                            // ...toDoUpdate
                        }
                    });

                this.setState({
                    result: result
                })
            })
    }

    _pushToMain(){
        this.props.navigator.push({
            component: Main,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }
    _pushToLogin(){
        this.props.navigator.push({
            component: Login,
            params: {
                ...this.props,
                theme: this.theme
            }
        })
    }
    render() {
        // return null;
        return(
            <View style={styles.container}>
                <Text>检查是否跟新</Text>
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
