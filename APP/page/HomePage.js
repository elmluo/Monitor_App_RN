import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image
} from 'react-native'

import {StackNavigator, TabNavigator} from 'react-navigation';

import Alarm from './Alarm';
import Monitor from './Monitor';
import Function from './Function'

import ChatScreen from './ChatScreen';

class HomePage extends React.Component{

    // 设置首页导航的配置内容
    static navigationOptions={
        title: '主控页面', //设置tab页标题
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        const {navigate} = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text style={{padding:10}}>
                    Hello navigation
                </Text>
                <Button
                    onPress={()=>{
                        navigate('Chat',{user: 'chaogege'})
                    }}
                    title='点击跳转'/>
            </View>
        )
    }
}

// 创建主屏幕tab栏配置
const MainScreenNavigator = TabNavigator({
    Home: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={require('../Resource/Image/Tab/tab_home_nor.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    Monitor: {
        screen: Monitor,
        navigationOptions: {
            tabBarLabel: '监控',
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={require('../Resource/Image/Tab/tab_monitor_nor.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    Alarm: {
        screen: Alarm,
        navigationOptions: {
            tabBarLabel: '告警',
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={require('../Resource/Image/Tab/tab_alarm_nor.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    Function: {
        screen: Function,
        navigationOptions: {
            tabBarLabel: '功能',
            tabBarIcon: ({ tintColor})=>(
                <Image
                    source={require('../Resource/Image/Tab/tab_subsystem_nor.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            )
        }
    }
}, {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: true, // 禁止左右滑动,如果开启，android的物理返回键可能不好使。
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    pressColor : 'blue', // android 按压时显示的颜色
    tabBarOptions: {
        activeTintColor: '#008AC9', // 文字和图片选中颜色
        inactiveTintColor: '#999', // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {height: 0, backgroundColor: 'blue'}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        style: {
            backgroundColor: '#fff', // TabBar 背景色
            // height: 44
        },
        labelStyle: {
            fontSize: 12, // 文字大小
        },
    },
});

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#fff'
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    }
});


class RecentChatsScreen extends React.Component {
    render() {
        return <Text>List of recent chats</Text>
    }
}

class AllContactsScreen extends React.Component {
    render() {
        return <Text>List of all contacts</Text>
    }
}

const SimpleApp = StackNavigator({
    Home: {screen: MainScreenNavigator},
    Chat:{screen: ChatScreen},
});

export default SimpleApp