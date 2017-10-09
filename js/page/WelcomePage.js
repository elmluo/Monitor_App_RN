/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import Main from './Main'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'
export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
        });
        this.timer=setTimeout(()=> {
            // SplashScreen.hide();
            this.props.navigator.resetTo({
                component: Main,
                params:{
                    theme:this.theme,
                }
            });
        }, 500);
    }
    componentWillUnmount(){
        // 组件卸载后取消定时器，防止多余异常出现
        this.timer && clearTimeout(this.timer);
    }
    render() {
        return null;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 29
    }
})
