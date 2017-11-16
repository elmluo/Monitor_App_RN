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
    NativeAppEventEmitter,
    DeviceEventEmitter,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinList from './BulletinList'
import MyInfoPage from '../my/MyInfoPage'
import HomeAlarmCell from './HomeAlarmCell'
import HomeStatisticChart from './HomeStatisticChart'
import BulletinSlideBar from './BulletinSlideBar'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'
import JPushModule from 'jpush-react-native';
import LoadingView from '../../common/LoadingView'

let storage = new Storage();
let dataRepository = new DataRepository();
let {width, height} = Dimensions.get('window');
export default class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,
            noticeCount: null,
            isShowNoticeBar: false,
            alarmCount: 0,
            visible: false,
            visibleCount: 0,
            fsuCount: [     // 初始化的数据结构和操作的数据结构统一
                {item: "在线", count: 2},
                {item: "离线", count: 0}
            ],
            allCount: 21,
            levelAlarm: [
                {item: "一级告警", count: 0},
                {item: "二级告警", count: 0},
                {item: "三级告警", count: 0},
                {item: "四级告警", count: 0},
            ],
            fsuWeekCount: [
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508094000117},
                {onlineCount: 1, offlineCount: 14, recordTime: 1508115600137},
            ],
        }
    }


    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
    }

    /**
     * 从本地获取登录信息，同时保存到单例，全局使用
     * @returns {Promise}
     * @private
     */
    _getStamp() {
        return new Promise((resolve, reject) => {
            dataRepository.fetchLocalRepository('/app/v2/user/login').then((result) => {
                storage.setLoginInfo(result);   // 保存loginInfo到单例
                resolve(result)
            }, (error) => {
                reject(error)
            })
        })
    }

    /**
     * 渲染navigationBar右侧按钮
     * @returns {XML}
     * @private
     */
    _renderRightButton() {
        let image = !!this.state.noticeCount
            ? <Image style={{width: 24, height: 24}} source={require('../../../res/Image/Nav/ic_notice_selected.png')}/>
            : <Image style={{width: 24, height: 24}} source={require('../../../res/Image/Nav/ic_notice_nor.png')}/>;
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
                        {image}
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
     * 获取FSU数量（按在线状态统计
     * @param stamp
     * @returns {Promise}
     * @private
     */
    _getFsuCount(data) {
        return new Promise((resolve, reject) => {
            let URL = '/app/v2/statistics/count/fsu';
            let params = {
                stamp: data.stamp
            };
            dataRepository.fetchNetRepository('POST', URL, params).then(result => {
                // console.log(result);
                // alert(JSON.stringify({'fsu数量': result}));
                // this.setState({
                //     fsuCount: result.data
                // })
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * 一周FSU数量
     * @private
     */
    _getWeekFsuCount(data) {
        return new Promise((resolve, reject) => {
            let URL = '/app/v2/statistics/counts/fsu/week';
            let params = {
                stamp: data.stamp
            };
            dataRepository.fetchNetRepository('POST', URL, params).then((result) => {
                // console.log(result);
                // 获取 一周fsu数量
                // alert(JSON.stringify({'一周FSU': result}));
                // console.log(result);
                // this.setState({
                //     fsuWeekCount: result.data
                // })
                resolve(result);
            }, (error) => {
                reject(error);
            })
        });
    }

    /**
     * 获取告警数量
     * @param stamp
     * @private
     */
    _getAlarmCount(data) {
        return new Promise((resolve, reject) => {
            let URL = '/app/v2/statistics/count/alarm';
            let params = {
                stamp: data.stamp,
                status: 2,
                type: 1
            };
            dataRepository.fetchNetRepository('POST', URL, params).then(result => {
                resolve(result);
            }, (error) => {
                reject(error)
            })
        })
    }

    /**
     * 获取公告未读数量
     * @private
     */
    _getNoticeNotReadCount() {
        // console.log('点我了');
        let url = '/app/v2/notice/unread/count';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            // console.log(result);
            // 发送通知显示底部首页badge
            DeviceEventEmitter.emit('setNoticeBadge', result.data);
            if (result.data === 0 || result.data === null) {
                this.setState({
                    isShowNoticeBar: false,
                    noticeCount: result.data,

                });
            } else {
                this.setState({
                    isShowNoticeBar: true,
                    noticeCount: result.data,
                })
            }
        })
    }

    /**
     * 刷新获取所有数据
     * @private
     */
    _refreshData() {
        //显示加载动画
        if (this.state.visibleCount === 0) {
            this.setState({
                visible: true,
            })
        }

        this._getStamp().then((stamp) => {
            // 三个请求操作都是promise操作的话，用Promise.all()
            Promise.all([
                this._getFsuCount(stamp),
                this._getWeekFsuCount(stamp),
                this._getAlarmCount(stamp),
                this._getNoticeNotReadCount(),
            ]).then((results) => {
                // console.log(results);
                // 计算告警数量总和
                let allCount = 0;
                for (let i = 0; i < results[2].data.length; i++) {
                    allCount += results[2].data[i].count
                }
                if (results[1].data.length !== 0) {
                    this.setState({
                        fsuWeekCount: results[1].data,
                    })
                } else {
                    // console.log('返回数据为空')
                }
                this.setState({
                    fsuCount: results[0].data,
                    // fsuWeekCount: results[1].data,
                    levelAlarm: results[2].data,
                    allCount: allCount,
                    visible: false,
                    visibleCount: 1,
                })
            });
            // this._getFsuCount(stamp);
            // this._getWeekFsuCount(stamp);
            // this._getAlarmCount(stamp);
        });
    }

    /**
     * 公告页提示条
     * @private
     */
    _renderBulletinSlideBar() {
        if (this.state.isShowNoticeBar) {
            return (
                <View style={styles.noticeWrapper}>
                    <BulletinSlideBar
                        style={{}}
                        isClose={this.state.isShowNoticeBar}
                        text={`您有${this.state.noticeCount}个公告信息，请点击查看`}
                        onPressText={() => {
                            this.props.navigator.push({
                                component: BulletinList,
                                params: {...this.props}
                            })
                        }}
                        onPressClose={() => {
                            this.setState({
                                isShowNoticeBar: false,
                            })
                        }}/>
                </View>
            )
        } else {
            return null
        }

    }

    /**
     * 渲染今日在线率统计
     */
    _renderTodayOnlineRate() {
        let onlineCount = this.state.fsuCount[0].count;
        let outLintCount = this.state.fsuCount[1].count;
        let sum = onlineCount + outLintCount;
        // console.log(sum);
        let onlineRateStyle;
        // alert(height);
        if (height < 667) {
            onlineRateStyle = {
                // flexDirection: 'row-reverse',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                top: 30,
                zIndex: 4,
                backgroundColor: 'transparent',
            }
        } else {
            onlineRateStyle = {
                justifyContent: 'center',
                position: 'absolute',
                top: 30,
                zIndex: 4,
                backgroundColor: 'transparent',
            }
        }
        return (
            <View style={onlineRateStyle}>

                <View style={styles.onlineRatePercent}>
                    <Text style={{color: '#FFFFFF', fontSize: 38}}>{Math.ceil((onlineCount / sum) * 100)}</Text>
                    <Text style={{color: '#FFFFFF', fontSize: 20, marginBottom: 7}}>%</Text>
                </View>

                <View style={styles.onlineRateText}>
                    <View style={styles.onlineRateTextTop}>
                        <Text style={{color: '#FFFFFF', fontSize: 14}}>今日FSU在线率</Text>
                    </View>
                    <View style={styles.onlineRageTextBottom}>
                        <Text style={{color: '#FFFFFF', fontSize: 12}}>在线: {this.state.fsuCount[0].count}</Text>
                        <Text style={{color: '#FFFFFF', fontSize: 12}}>离线: {this.state.fsuCount[1].count}</Text>
                    </View>
                </View>

            </View>
        )
    }

    /**
     *
     */
    _renderLevelAlarm() {
        return (
            <View style={styles.alarmWrap}>
                <View style={styles.alarm}>
                    {/* 通过TouchableOpacity组件将路由切换到告警页 */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            DeviceEventEmitter.emit('turn_to_firstPage');
                            this.props.routerChange('tb_alarm', {level: ['1']});
                        }}>
                        <HomeAlarmCell count={this.state.levelAlarm[0].count}
                                       allCount={this.state.allCount}
                                       alarmName={this.state.levelAlarm[0].item}
                                       alarmColor='#1CCAEB'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            DeviceEventEmitter.emit('turn_to_firstPage');
                            this.props.routerChange('tb_alarm', {level: ['2']});
                        }}>
                        <HomeAlarmCell count={this.state.levelAlarm[1].count}
                                       allCount={this.state.allCount}
                                       alarmName={this.state.levelAlarm[1].item}
                                       alarmColor='#F63232'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            DeviceEventEmitter.emit('turn_to_firstPage');
                            this.props.routerChange('tb_alarm', {level: ['3']});
                        }}>
                        <HomeAlarmCell count={this.state.levelAlarm[2].count}
                                       allCount={this.state.allCount}
                                       alarmName={this.state.levelAlarm[2].item}
                                       alarmColor='#F9AE46'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            DeviceEventEmitter.emit('turn_to_firstPage');
                            this.props.routerChange('tb_alarm', {level: ['4']});
                        }}>
                        <HomeAlarmCell count={this.state.levelAlarm[3].count}
                                       allCount={this.state.allCount}
                                       alarmName={this.state.levelAlarm[3].item}
                                       alarmColor='#E6CD0D'/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        // console.log(this.state.fsuWeekCount);
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
                        }}
                        tintColor={this.props.theme.themeColor}
                    />
                }>
                <View style={{flex: 1}}>
                    <ImageBackground style={styles.gb}
                                     source={require('../../../res/Image/Login/ic_login_bg.png')}>
                        {this._renderBulletinSlideBar()}
                        {this._renderTodayOnlineRate()}
                        <HomeStatisticChart chartData={this.state.fsuWeekCount}
                                            width={width}
                                            height={height * 0.4}/>
                    </ImageBackground>
                    {this._renderLevelAlarm()}
                </View>
            </ScrollView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                <LoadingView showLoading={this.state.visible}/>
            </View>
        )
    }

    // shouldComponentUpdate(nextProps,nextState){
    //     //写自己的逻辑判断是否需要更新组件
    //     return false;
    // }

    componentDidMount() {


        if (Platform.OS === 'ios') {
            // console.log("iOS : ");
            //推送消息
            JPushModule.addReceiveNotificationListener((message) => {
                console.log("获取推送消息 " + JSON.stringify(message));
                if (message.type != 200) {
                    //收到告警推送刷新列表
                    this._refreshData();
                }
                storage.setBadge(message.aps.badge);
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer);
                    DeviceEventEmitter.emit('setBadge', message.type, message.aps.badge);
                }, 0);

            });
            //点击跳转

            JPushModule.addReceiveOpenNotificationListener((map) => {
                console.log("点击 " + JSON.stringify(map));
                if (map.type == 200) {
                    const routes = this.props.navigator.state.routeStack;
                    // console.log(routes);
                    let lent = 0;
                    for (let i = 0; i < routes.length; i++) {
                        if (routes[i].component.name === "BulletinList") {
                            this.props.navigator.popToRoute(routes[i]);
                        } else {
                            lent++;
                        }
                    }
                    if (lent == routes.length) {
                        this.props.navigator.push({
                            component: BulletinList,
                            params: {...this.props}
                        })
                    }
                } else {
                    storage.setBadge(map.aps.badge);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        DeviceEventEmitter.emit('setBadge', map.type, map.aps.badge);
                    }, 0);
                }


            });
        } else {
            // // console.log("Android: ");
            JPushModule.notifyJSDidLoad((resultCode) => {
                // console.log("注册事件: ", resultCode);

            });
            //推送消息
            JPushModule.addReceiveNotificationListener((message) => {

                console.log("获取推送消息 " + JSON.stringify(message));
                console.log('告警安卓badge' + this.state.alarmCount);
                if (JSON.parse(message.extras).type != 200) {
                    //收到告警推送刷新列表
                    this._refreshData();
                    this.state.alarmCount++;
                    storage.setBadge(this.state.alarmCount);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        DeviceEventEmitter.emit('setBadge', message.extras.type, this.state.alarmCount);
                    }, 0);
                } else {
                    this._getNoticeNotReadCount();
                }
            });

            this.listener = DeviceEventEmitter.addListener('clearAndroidBadge', () => {
                this.setState({
                    alarmCount: 0,
                })
            });

            //点击跳转
            JPushModule.addReceiveOpenNotificationListener((map) => {
                console.log("点击 " + JSON.stringify(map));
                const routes = this.props.navigator.state.routeStack;
                if (JSON.parse(map.extras).type == 200) {
                    //跳转详情页面 清除this.state.alarmCount
                    this.state.alarmCount = 0;
                    const routes = this.props.navigator.state.routeStack;
                    // console.log(routes);
                    let lent = 0;
                    for (let i = 0; i < routes.length; i++) {
                        if (routes[i].component.name === "BulletinList") {
                            this.props.navigator.popToRoute(routes[i]);
                        } else {
                            lent++;
                        }
                    }
                    if (lent == routes.length) {
                        this.props.navigator.push({
                            component: BulletinList,
                            params: {...this.props}
                        })
                    }
                } else {
                    storage.setBadge(this.state.alarmCount);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        DeviceEventEmitter.emit('setBadge', map.extras.type, this.state.alarmCount);
                    }, 0);
                }


            });

        }


        // 页面加载完成再去渲染数据，减缓卡顿问题
        InteractionManager.runAfterInteractions(() => {
            this._refreshData();
            this._getStamp().then((stamp) => {
                this._getNoticeNotReadCount(stamp);
            })
        });


        // 添加监听。看完公告内容后，重新获取未读公告数量。
        this.listener = DeviceEventEmitter.addListener('getNoticeNotReadCount', () => {
            // this._getNoticeNotReadCount()
            this._refreshData();
            if (Platform.OS === 'ios') {
                JPushModule.setBadge(0, (badgeNumber) => {
                    console.log(badgeNumber)
                });
            }
        })
    }

    componentWillUnmount() {
        // 组件卸载后取消定时器，防止多余异常出现
        // this.timer && clearTimeout(this.timer);
        JPushModule.removeConnectionChangeListener();
        JPushModule.removeOpenNotificationLaunchAppEventListener();
        JPushModule.removeReceiveNotificationListener();


        this.listener.remove();
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
        position: 'relative'
    },
    noticeWrapper: {
        width: width,
        position: 'absolute',
        zIndex: 3,
    },
    // onlineRate: {
    //     justifyContent: 'center',
    //     position: 'absolute',
    //     top: 30,
    //     zIndex: 4,
    //     backgroundColor: 'transparent',
    //     marginLeft: 20,
    // },
    onlineRatePercent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginLeft: 20,
    },
    onlineRateText: {
        width: 130,
        justifyContent: 'center',
        marginLeft: 20,
    },
    onlineRateTextTop: {},
    onlineRageTextBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        justifyContent: 'space-around',
        paddingLeft: 16,
        paddingRight: 16,
    },

});

