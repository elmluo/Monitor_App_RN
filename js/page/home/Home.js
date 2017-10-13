/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Platform,
    Dimensions,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinList from './BulletinList'
import MyPage from '../my/MyPage'
import HomeAlarmCell from './HomeAlarmCell'

let {width, height} = Dimensions.get('window');

export default class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,
            cellData: {
                count: 123,
                color: '#ff0000',
                name: '一级告警'
            }
        }
    }

    /**
     * 渲染navigationBar右侧按钮
     * @returns {XML}
     * @private
     */
    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: BulletinList,
                            params: {...this.props}
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_notice_nor.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 渲染navigationBar右侧按钮
     * @returns {XML}
     * @private
     */
    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: MyPage,
                            params: {...this.props}
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                        style={{width:24,height:24}}
                        source={require('../../../res/Image/Nav/ic_myItem.png')}
                        />
                        {/*<Text>个人</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'主控页面'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                rightButton={this._renderRightButton()}
                leftButton={this._renderLeftButton()}/>;
        let content =
            <ScrollView
                style={styles.scrollView}
                ref='scrollView'
                horizontal={false}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}  // 水平滚动条控制
                pagingEnabled={true}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor={this.props.theme.themeColor}
                        colors={[this.props.theme.themeColor]}
                        refreshing={this.state.isLoading}
                        onRefresh={() => alert('将重新加载数据')}
                        tintColor={this.props.theme.themeColor}
                    />
                }>
                <View style={{flex: 1}}>
                    <ImageBackground
                        style={styles.gb}
                        source={require('../../../res/Image/Login/ic_login_bg.png')}
                    >
                        <View style={styles.overlay}>
                            <Text>
                                这里是图表内容
                            </Text>
                            <Text>
                                2017.09.15
                            </Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.alarm}>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                    </View>
                </View>
            </ScrollView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>

        )
    }

    componentDidMount() {

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollView: {
      backgroundColor: 'pink'
    },
    gb: {
        width: width,
        height: 0.4 * height,
    },
    overlay: {
        position: 'absolute',
        // bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        // alignItems: 'center',
    },

    alarm: {
        position: 'relative',
        top: -height* 0.05,
        marginLeft: 16,
        marginRight: 16,
    },

});

