/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
    DeviceEventEmitter,
} from 'react-native'
import AlarmFilter from './alarmFilter'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Storage from '../../common/StorageClass'
import AlarmTab from './AlarmTab'

let storage = new Storage();
export default class Alarm extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            theme: this.props.theme,
            initialPage: 1,
            isHisAlarm: true,
            focusPage: 1,
            alarmPage: 1,
            historyPage: 1,
            // 告警筛选条件
            filter: {
                level: [],
                deviceType: [],
                siteId: []
            }
        };
    }

    _renderRightButton() {
        let scope = this;
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        scope.props.navigator.push({
                            component: AlarmFilter,
                            params: {
                                ...scope.props,
                                setFilter: (v) => {
                                    scope.setState({
                                        filter: v
                                    })
                                },
                                filter: scope.state.filter
                            }
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Text style={{color: '#FFFFFF'}}>
                            筛选
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    //筛选条件
    //站点 siteId 数组
    //设备类型 deviceType 数组
    //告警等级 level 数组
    //默认不传，返回所有数据

    _this_Params(initialPage, isHisAlarm) {
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            size: 20,
        };
        //参数逻辑判断
        if (initialPage === 0) {
            //关注告警参数
            // page = this.setState.focusPage ++;
            params.page = this.state.focusPage;

        } else {
            if (isHisAlarm === true) {
                params.status = 2;
                params.page = this.state.alarmPage;


            } else {
                params.status = 1;
                params.page = this.state.historyPage;
            }
        }
        return params;
    }

    render() {
        // this.state.filter.level = this.props.crossPageData ? this.props.crossPageData.level || [] : [];
        // this.props.setCrossPageData(null);
        if (this.props.crossPageData && this.props.crossPageData.level) {
            // alert(JSON.stringify(this.props.crossPageData.level))
            this.state.filter.level = this.props.crossPageData.level;
            this.props.setCrossPageData(null, false);
        }

        // alert(JSON.stringify(this.state.filter))
        // 请求会报错，为空的话，需要变成undefined。
        if (this.state.filter.level && this.state.filter.level.length === 0) {
            this.state.filter.level = undefined;
        }
        if (this.state.filter.siteId && this.state.filter.siteId.length === 0) {
            this.state.filter.siteId = undefined;
        }
        if (this.state.filter.deviceType && this.state.filter.deviceType.length === 0) {
            this.state.filter.deviceType = undefined;
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            DeviceEventEmitter.emit('custom_listView_alarm', this.state.filter);
        }, 0);

        // alert(JSON.stringify(this.state.filter))
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };

        let navigationBar =
            <NavigationBar
                title={'告警页面'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                rightButton={this._renderRightButton()}/>;
        let content =
            <ScrollableTabView
                ref='scrollableTabView'
                tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='#FFFFFF'
                tabBarBackgroundColor={this.state.theme.themeColor}
                initialPage={0}>
                <AlarmTab tabLabel='实时告警'
                          {...this.props}
                          params={{...this._this_Params(1, true), ...this.state.filter}}
                          isAlarm={false}
                          url={'/app/v2/alarm/list'}
                          filter={this.state.filter}>
                    实时告警
                </AlarmTab>
                <AlarmTab tabLabel='关注告警'
                          {...this.props}
                          params={{...this._this_Params(0, true), ...this.state.filter}}
                          isAlarm={false}
                          url={'/app/v2/alarm/focus/list'}
                          filter={this.state.filter}>
                    关注告警
                </AlarmTab>
                <AlarmTab tabLabel='历史告警'
                          {...this.props}
                          params={{...this._this_Params(2, false), ...this.state.filter}}
                          isAlarm={true}
                          url={'/app/v2/alarm/list'}
                          filter={this.state.filter}>
                    历史告警
                </AlarmTab>
            </ScrollableTabView>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
