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
    InteractionManager,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinList from './BulletinList'
import MyPage from '../my/MyPage'
import MyInfoPage from '../my/MyInfoPage'
import HomeAlarmCell from './HomeAlarmCell'
import HomeStatisticChart from './HomeStatisticChart'
import DataRepository from '../../expand/dao/Data'

let dataRepository = new DataRepository();
let {width, height} = Dimensions.get('window');
export default class Monitor extends Component {
    constructor(props) {
        // 去除本地保存的stamp
        dataRepository.fetchLocalRepository('/app/v2/user/login').then((result) => {
            this.state.stamp = result.stamp;
        });
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,
            fsuCount: [
                {item: "在线", count: 1}
            ],
            // allCount: null,
            levelAlarm: [
                {item: "一级告警", count: 7},
                {item: "二级告警", count: 1},
                {item: "三级告警", count: 19},
                {item: "四级告警", count: 0},
            ],
            fsuWeekCount: [
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508115600137},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508137200332},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508158800171},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508180400187},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508202000173},
            ],
            chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
     * 渲染navigationBar左侧按钮
     * @returns {XML}
     * @private
     */
    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: MyInfoPage,
                            params: {...this.props}
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_myItem.png')}
                        />
                        {/*<Text>个人</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 获取企业唯一码
     * @returns {Promise}
     * @private
     */
    _getStamp() {
        return new Promise((resolve, reject) => {
            dataRepository.fetchLocalRepository('/app/v2/user/login').then((result) => {
                resolve(result.stamp)
            }, (error) => {
                console.log(error);
                reject(error)
            })
        })
    }

    /**
     * 获取FSU数量（按在线状态统计）
     * @private
     */
    _getFsuCount(stamp) {
        let URL = '/app/v2/statistics/count/fsu';
        let params = {
            stamp: stamp
        };
        dataRepository.fetchNetRepository('POST', URL, params)
            .then(result => {
                // console.log(result);
                // alert(JSON.stringify({'fsu数量': result}));
                this.setState.fsuCount = result.data;
            })
    }

    /**
     * 一周FSU数量
     * @private
     */
    _getWeekFsuCount(stamp) {
        let URL = '/app/v2/statistics/counts/fsu/week';
        let params = {
            stamp: stamp
        };
        dataRepository.fetchNetRepository('POST', URL, params)
            .then(result => {
                console.log(result);
                // 获取 一周fsu数量
                alert(JSON.stringify({'一周FSU': result}));
                console.log(result);
                this.setState.fsuWeekCount = result.data;
            })
    }

    /**
     * 获取告警数量
     * @param stamp
     * @private
     */
    _getAlarmCount(stamp) {
        let URL = '/app/v2/statistics/count/alarm';
        let params = {
            stamp: stamp,
            status: 2,
            type: 1
        };
        dataRepository.fetchNetRepository('POST', URL, params)
            .then(result => {
                alert(JSON.stringify({'alarm数量': result}));
                console.log(result);
                this.setState.levelAlarm = result.data;
                let allCount = 0;
                for (let i = 0; i < result.data.length; i++) {
                    allCount += result.data[i].count
                }
                this.setState.allCount = allCount;
            })
    }

    /**
     * 刷新获取所有数据
     * @private
     */
    _refreshData() {
        this._getStamp().then((stamp) => {
            // // 三个请求操作都是promise操作的话，用Promise.all()
            // Promise.all([
            //     this._getFsuCount(stamp),
            //     // this._getWeekFsuCount(stamp),
            //     this._getAlarmCount(stamp)
            // ]).then((results)=> {
            //     console.log(results);
            // });
            this._getFsuCount(stamp);
            this._getWeekFsuCount(stamp);
            this._getAlarmCount(stamp);
        });
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
                        onRefresh={() => {
                            this._refreshData();
                            this.setState({
                                chartData: new Array(10).join(' ').split(' ').map(function (v) {
                                    return Math.floor(Math.random() * 10);
                                })
                            });
                        }}
                        tintColor={this.props.theme.themeColor}
                    />
                }>
                <View style={{flex: 1}}>
                    <ImageBackground
                        style={styles.gb}
                        source={require('../../../res/Image/Login/ic_login_bg.png')}
                    >
                        <HomeStatisticChart chartData={this.state.chartData} width={width} height={height * 0.4}/>
                    </ImageBackground>
                    <View style={styles.alarmWrap}>
                        <View style={styles.alarm}>
                            <HomeAlarmCell
                                count={this.state.levelAlarm[0].count}
                                allCount={this.state.allCount}
                                alarmName={this.state.levelAlarm[0].item}
                                alarmColor='#1CCAEB'/>
                            <HomeAlarmCell
                                count={this.state.levelAlarm[1].count}
                                allCount={this.state.allCount}
                                alarmName={this.state.levelAlarm[1].item}
                                alarmColor='#F63232'/>
                            <HomeAlarmCell
                                count={this.state.levelAlarm[2].count}
                                allCount={this.state.allCount}
                                alarmName={this.state.levelAlarm[2].item}
                                alarmColor='#F9AE46'/>
                            <HomeAlarmCell
                                count={this.state.levelAlarm[3].count}
                                allCount={this.state.allCount}
                                alarmName={this.state.levelAlarm[3].item}
                                alarmColor='#E6CD0D'/>
                        </View>
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
        // 页面加载完成再去渲染数据，减缓卡顿问题
        InteractionManager.runAfterInteractions(() => {
            this._refreshData()
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollView: {
        backgroundColor: '#F3F3F3'
    },
    gb: {
        width: width,
        height: 0.4 * height,
    },
    overlay: {
        width: width,
        height: 0.1 * height,
        position: 'absolute',
        // bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // alignItems: 'center',
    },
    alarmWrap: {
        width: width,
        height: 0.4 * height,
        position: 'relative',
    },
    alarm: {
        position: 'absolute',
        top: -height * 0.05,
        width: width,
        height: 0.45 * height,
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
    },

});

