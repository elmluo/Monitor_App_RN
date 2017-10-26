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
import MyInfoPage from '../my/MyInfoPage'
import HomeAlarmCell from './HomeAlarmCell'
import HomeStatisticChart from './HomeStatisticChart'
import BulletinSlideBar from './BulletinSlideBar'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'
import JPushModule from 'jpush-react-native';

let storage = new Storage();
let dataRepository = new DataRepository();
let {width, height} = Dimensions.get('window');

export default class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,
            noticeCount: 6,
            isShowNoticeBar: false,
            fsuCount: [
                {item: "在线", count: 1}
            ],
            allCount: 21,
            levelAlarm: [
                {item: "一级告警", count: 7},
                {item: "一级告警", count: 7},
                {item: "一级告警", count: 7},
                {item: "一级告警", count: 7},
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




    componentWillUnmount(){
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
        let image = this.state.isShowNoticeBar
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
                // alert(JSON.stringify({'alarm数量': result}));
                // console.log(result);
                // this.setState({
                //     levelAlarm: result.data
                // });

                // 计算告警数量总和


                // this.setState({
                //     allCount: allCount
                // });
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
        let url = '/app/v2/notice/unread/count';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            // alert(JSON.stringify(result));
            if (result.data === 0 || result.data === null) {
                this.setState({
                    isShowNoticeBar: false,
                })
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
        this._getStamp().then((stamp) => {
            // 三个请求操作都是promise操作的话，用Promise.all()
            Promise.all([
                this._getFsuCount(stamp),
                this._getWeekFsuCount(stamp),
                this._getAlarmCount(stamp),
            ]).then((results) => {
                // 计算告警数量总和
                let allCount = 0;
                for (let i = 0; i < results[0].data.length; i++) {
                    allCount += results[0].data[i].count
                }

                this.setState({
                    fsuCount: results[0].data,
                    fsuWeekCount: results[1].data,
                    levelAlarm: results[2].data,
                    allCount: allCount
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
                            isShowNoticeBar: true,
                        })
                    }}/>
            )
        } else {
            return null
        }

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
                        }}
                        tintColor={this.props.theme.themeColor}
                    />
                }>
                <View style={{flex: 1}}>
                    <ImageBackground
                        style={styles.gb}
                        source={require('../../../res/Image/Login/ic_login_bg.png')}>

                        {this._renderBulletinSlideBar()}

                        <HomeStatisticChart chartData={this.state.fsuWeekCount}
                                            width={width}
                                            height={height * 0.4}/>
                    </ImageBackground>
                    <View style={styles.alarmWrap}>
                        <View style={styles.alarm}>
                            {/**/}
                            <TouchableOpacity 
                                onPress = {() => {this.props.routerChange('tb_alarm', '一级告警');}}>
                                <HomeAlarmCell
                                    count={this.state.levelAlarm[0].count}
                                    allCount={this.state.allCount}
                                    alarmName={this.state.levelAlarm[0].item}
                                    alarmColor='#1CCAEB'/></TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => {this.props.routerChange('tb_alarm', '二级告警');}}>
                                <HomeAlarmCell
                                    count={this.state.levelAlarm[1].count}
                                    allCount={this.state.allCount}
                                    alarmName={this.state.levelAlarm[1].item}
                                    alarmColor='#F63232'/></TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => {this.props.routerChange('tb_alarm', '三级告警');}}>
                                <HomeAlarmCell
                                    count={this.state.levelAlarm[2].count}
                                    allCount={this.state.allCount}
                                    alarmName={this.state.levelAlarm[2].item}
                                    alarmColor='#F9AE46'/></TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => {this.props.routerChange('tb_alarm', '四级告警');}}>
                                <HomeAlarmCell
                                    count={this.state.levelAlarm[3].count}
                                    allCount={this.state.allCount}
                                    alarmName={this.state.levelAlarm[3].item}
                                    alarmColor='#E6CD0D'/></TouchableOpacity>
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

    // shouldComponentUpdate(nextProps,nextState){
    //     //写自己的逻辑判断是否需要更新组件
    //     return false;
    // }

    componentDidMount() {
        // alert(123456);
        //---------------------------------android start---------------------------------

        JPushModule.addReceiveCustomMsgListener((message) => {

            //这是默认的通知消息

              this.setState({pushMsg:message});
              alert('默认推送消息'+message);

        });

        // JPushModule.addReceiveNotificationListener((map) => {
        //
        //     //自定义推送的消息
        //
        //     //console.log("alertContent: " + map.alertContent);
        //
        //     //extra是可选配置上的附件字段
        //
        //     //console.log("extras: " + map.extras);
        //
        //     var message = JSON.parse(map.extras);
        //
        //     // this.stora是可选配置上的附件字段reDB(message);//我这里是把内容存在了数据库里面，你可以把这里的message放到state里面显示出来
        //     alert(message);
        //     //这里面解析json数据，并存在数据库中，同时显示在通知栏上
        //
        // })

        //点击通知进入应用的主页，相当于跳转到制定的页面

        // JPushModule.addReceiveOpenNotificationListener((map) => {
        //
        //     //console.log("Opening notification!");
        //
        //     this.props.navigator.replace({name: "HomePage",component:HomePage});
        //
        // })

        //---------------------------------android end---------------------------------

        //---------------------------------ios start---------------------------------

        // NativeAppEventEmitter.addListener(
        //
        //     'ReceiveNotification',
        //
        //     (message) => {
        //
        //         //下面就是发送过来的内容，可以用stringfy打印发来的消息
        //
        //         console.log("content: " + JSON.stringify(message));
        //     });
                //下面的json就是我在极光推送上的附件字段内容就是上面的log打印出来的东西

                // {

                //    "_j_msgid": 4572771355, 

                //    "content": "日志第一天", 

                //    "time": "2016-11-18/13:11:09", 

                //    "aps": {

                //        "sound": "default",  

                //        "badge": 1, 

                //        "alert": "测试ios1" 

                //    }, 

                //    "name": "刘成",

                //    "age": "28", 

                //    "性别": "男",

                //"qq":"674668211"，

                //"手机号":"674668211"，

                // } console.log("_j_msgid:" + message._j_msgid);

                //这个是极光的消息id console.log("content:" + message.content);

                //这是标题 console.log("aps:" + message.aps.sound);

                //这是声音 console.log("aps:" + message.aps.badge);

                //这是上标 console.log("aps:" + message.aps.alert);

                //这是发送通知的主内容 this.storeDB(message); } );

                //---------------------------------ios end---------------------------------

        JPushModule.addGetRegistrationIdListener((registrationId) => {
            console.log("Device register succeed, registrationId " + registrationId);
            alert("Device register succeed, registrationId " + registrationId);

        });
        // 页面加载完成再去渲染数据，减缓卡顿问题
        InteractionManager.runAfterInteractions(() => {
            this._refreshData();
            this._getStamp().then((stamp) => {
                this._getNoticeNotReadCount(stamp);
            })
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

