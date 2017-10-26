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
} from 'react-native'
import AlarmFilter from './alarmFilter'
import AlarmDetail from './AlarmDetail'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Storage from '../../common/StorageClass'
import CustomListView from '../../common/CustomListView'
import Utils from '../../util/Utils'

let storage = new Storage();

let StorageFunction = new Storage();
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
        }
    }

    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: AlarmFilter,
                            params: {
                                ...this.props
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
            stamp: StorageFunction.getLoginInfo().stamp,
            userId: StorageFunction.getLoginInfo().userId,
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
                initialPage={1}>
                <AlarmTab tabLabel='关注告警' {...this.props} params={this._this_Params(0, true)} isAlarm={false}
                          url={'/app/v2/alarm/focus/list'}>关注告警</AlarmTab>
                <AlarmTab tabLabel='实时告警' {...this.props} params={this._this_Params(1, true)} isAlarm={false}
                          url={'/app/v2/alarm/list'}>实时告警</AlarmTab>
                <AlarmTab tabLabel='历史告警' {...this.props} params={this._this_Params(2, false)} isAlarm={true}
                          url={'/app/v2/alarm/list'}>历史告警</AlarmTab>
            </ScrollableTabView>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}


/**
 * 封装一个单独的组件类，
 * 充当scrollableTabView的tab页面
 */
class AlarmTab extends Component {


    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),

        }
    }

    _postSelectedAlarm(alarmId) {
        this.setState({
            isLoading: true
        });
        let url = '/app/v2/alarm/focus/change';
        let params = {
            userId: storage.getLoginInfo().userId,
            stamp: storage.getLoginInfo().stamp,
            alarmId: alarmId,
        };


        // 切换不同标签页，通过tabBle
        // alert(JSON.stringify(url));
        // alert(JSON.stringify(params));
        this.dataRepository.fetchNetRepository('POST', url, params)
            .then(result => {

                if (result.success === true) {
                    alert(JSON.stringify(result));

                    // let result = this._inAlarmIDArr(this.alarmIDArr, alarmId);
                    // alert(result);
                    //
                    // if (result) {
                    //     this.alarmIDArr.splice(this.alarmIDArr.indexOf(alarmId), 1);
                    // } else {
                    //     this.alarmIDArr.push(alarmId)
                    // }
                    this.setState({
                        // alarmIDArr: this.alarmIDArr,
                        // success:result.success,
                        url: this.props.url,


                    });

                }
            })
    }


    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        let alarmIconSource;
        switch (rowData.level) {
            case '1':
                alarmIconSource = require('../../../res/Image/BaseIcon/ic_oneAlarm_nor.png');
                break;
            case '2':
                alarmIconSource = require('../../../res/Image/BaseIcon/ic_twoAlarm_nor.png');
                break;
            case '3':
                alarmIconSource = require('../../../res/Image/BaseIcon/ic_threeAlarm_nor.png');
                break;
            default:
                alarmIconSource = require('../../../res/Image/BaseIcon/ic_fourAlarm_nor.png');
        }

        // this.setState({
        //     focus:rowData.focus,
        //
        // });

        return (
            <View style={{position: 'relative'}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        this._pushToDetail(rowData, this.props.isAlarm)
                    }}>
                    <View style={styles.cell}>
                        <View style={styles.cellLeft}>
                            <Image
                                source={alarmIconSource}/>
                        </View>
                        <View style={styles.cellRight}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 10
                            }}>
                                <Text style={{color: '#444444', fontSize: 16}}>{rowData.name}</Text>
                                <Text style={{color: '#7E7E7E', fontSize: 12}}>{Utils._Time(rowData.reportTime)}</Text>
                            </View>
                            <View>
                                <Text style={{color: '#7E7E7E', fontSize: 14}}>{rowData.siteName}</Text>
                            </View>
                            <View>
                                <Text style={{color: '#7E7E7E', fontSize: 14}}>{rowData.deviceName}</Text>
                            </View>

                        </View>
                    </View>

                </TouchableOpacity>


                <View style={{position: 'absolute', right: 10, bottom: 10}}>
                    <TouchableOpacity onPress={() => {

                        this._postSelectedAlarm(rowData.alarmId);
                    }}>
                        <View style={{width: 100, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            {

                                rowData.focus
                                    ? <View style ={{width: 100,alignItems: 'center', justifyContent: 'center',flexDirection:'row',backgroundColor:'rgba(0,0,0,0)'}} >
                                        <Image style={{width: 10, height: 10}}
                                               source={require('../../../res/Image/Alarm/ic_focus_selected.png')}/>
                                        <Text style = {{left:5,fontSize:12,color:'rgb(126,126,126)'}}>已关注</Text>
                                    </View>
                                    : <View  style ={{width: 100,alignItems: 'center', justifyContent: 'center',flexDirection:'row',backgroundColor:'rgba(0,0,0,0)'}}>
                                        <Image style={{width: 10, height: 10}}
                                               source={require('../../../res/Image/Alarm/ic_focus_nor.png')}/>
                                        <Text style = {{left:5,fontSize:12,color:'rgb(126,126,126)'}}>未关注</Text>
                                    </View>
                            }

                        </View>

                    </TouchableOpacity>

                </View>
            </View>

        )
    }

    _pushToDetail(rowData, isHisAlarm) {
        this.props.navigator.push({
            component: AlarmDetail,
            params: {
                item: rowData,
                isHisAlarm: isHisAlarm,
                ...this.props
            }
        })
    }

    render() {

        let content = <CustomListView
            {...this.props}
            isAutoRefresh={true}
            url={this.props.url}
            params={this.props.params}
            // bind(this)机制需要熟悉
            renderRow={this._renderRow.bind(this)}
            alertText={'没有更多数据了~'}
        />;
        return (
            <View style={styles.container}>
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cell: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'white'
    },
    cellLeft: {},
    cellRight: {
        flex: 1,
        marginLeft: 14,
    }
});
