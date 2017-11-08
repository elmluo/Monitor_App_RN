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
    Dimensions,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/Utils'
import BackPressComponent from '../../common/BackPressComponent'

let {width, height} = Dimensions.get('window')
export default class AlarmDetail extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
        }
    }

    componentDidMount() {
        // android物理返回监听事件
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        // 卸载android物理返回键监听
        this.backPress.componentWillUnmount();
    }

    /**
     * 点击 android 返回键触发
     * @param e 事件对象
     * @returns {boolean}
     */
    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.pop();
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    //修改密码点击时间
    onClick(tab) {

    }

    getItem(tag, leftIcon, text, rightIcon, rightText) {
        return ViewUtils.getCellItem(() => this.onClick(tag), leftIcon, text, rightIcon, rightText);
    }

    alarmLevelName(level) {
        let alarmLevelName;
        switch (level) {
            case '1':
                alarmLevelName = '一级告警';
                break;
            case '2':
                alarmLevelName = '二级告警';
                break;
            case '3':
                alarmLevelName = '三级告警';
                break;
            case '4':
                alarmLevelName = '四级告警';
                break;
            default:
                ;

        }
        return alarmLevelName;

    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'告警详情页'}
                statusBar={statusBar}
                style={{backgroundColor: 'rgba(0,0,0,0)'}}
                leftButton={this._renderLeftButton()}/>;
        let cell;
        let line;
        if (this.props.isHisAlarm === true) {

            cell = this.getItem(null, require('../../../res/Image/Alarm/ic_alarmDetail_start.png'), '恢复时间', null, this.props.item.recoverTime ? Utils.FormatTime(new Date(this.props.item.recoverTime),'yyyy-MM-dd hh:mm') : '--');
            line = <View style={styles.line}/>
        }
        return (
            <View style={styles.container}>

                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{alignItems: 'center'}}>
                        <ImageBackground style={{height: height * 0.45, width: width,}}
                                         source={require('../../../res/Image/Alarm/ic_alarmDetail_headerBg.png')}
                                         resizeMode='cover'>
                            {navigationBar}
                            <View style={{backgroundColor: 'rgba(0,0,0,0)', top: 58}}>
                                <Text style={{fontSize: 30, fontWeight: '800', color: '#FFF', textAlign: 'center'}}>
                                    {this.props.item.name}
                                    {/*烟雾告警*/}
                                </Text>
                            </View>

                            <View style={{backgroundColor: 'rgba(0,0,0,0)', top: 70}}>
                                <Text style={{fontSize: 14, color: '#FFF', textAlign: 'center'}}>
                                    {this.props.item.siteName}
                                    {/*国家大学科技园站*/}
                                </Text>
                            </View>
                            <View style={{backgroundColor: 'rgba(0,0,0,0)', top: 90, alignItems: 'center'}}>

                                <ImageBackground style={{height: 30, width: 92, justifyContent: 'center'}}
                                                 source={require('../../../res/Image/Alarm/ic_alarmDetail_btnBg.png')}
                                                 resizeMode='cover'>
                                    <Text style={{fontSize: 12, color: '#FFF', textAlign: 'center'}}>
                                        {this.alarmLevelName(this.props.item.level)}
                                        {/*一级告警*/}
                                    </Text>
                                </ImageBackground>
                            </View>
                        </ImageBackground>
                        <View style={{position: 'relative', top: 50}}>
                            {this.getItem(null, require('../../../res/Image/Alarm/ic_alarmDetail_turned.png'), '设备名称', null, this.props.item.deviceName ? this.props.item.deviceName : '--')}
                            <View style={styles.line}/>
                            {this.getItem(null, require('../../../res/Image/Alarm/ic_alarmDetail_start.png'), '告警时间', null, this.props.item.reportTime ? Utils.FormatTime(new Date(this.props.item.reportTime),'yyyy-MM-dd hh:mm') : '--')}
                            <View style={styles.line}/>
                            {this.getItem(null, require('../../../res/Image/Alarm/ic_alarmDetail_notifications.png'), '告警详情', null, this.props.item.detail ? this.props.item.detail : '--')}
                            <View style={styles.line}/>
                            {this.getItem(null, require('../../../res/Image/Alarm/ic_alarmDetail_loyalty.png'), '告警阈值', null, this.props.item.threshold ? this.props.item.threshold : '--')}
                            <View style={styles.line}/>
                            {cell}
                            {line}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    line: {
        left: 10,
        width: width - 10,
        height: 1,
        backgroundColor: 'rgba(235,235,235,1)',
    },
});
