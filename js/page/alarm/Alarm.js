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
import SearchPage from '../SearchPage01'
import AlarmDetail from './AlarmDetail'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Storage from '../../common/StorageClass'
import CustomListView from '../../common/CustomListView'
let storage = new Storage();

let StorageFunction = new Storage();
export default class Alarm extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            theme: this.props.theme,
            initialPage:1,
            isHisAlarm: true,
            focusPage:1,
            alarmPage: 1,
            historyPage:1,

        }
    }

    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: SearchPage,
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

    _this_Params(initialPage,isHisAlarm){
        let params={
            stamp:StorageFunction.getLoginInfo().stamp,
            userId:StorageFunction.getLoginInfo().userId,
            size:20,
        };
        //参数逻辑判断
        if (initialPage === 0){
            //关注告警参数
            // page = this.setState.focusPage ++;
            params.page = this.state.focusPage;

        }else {
            if(isHisAlarm === true){
                params.status = 2;
                params.page = this.state.alarmPage;


            }else{
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
                <AlarmTab tabLabel='关注告警' {...this.props} params={this._this_Params(0,true)} url={'/app/v2/alarm/focus/change'}>关注告警</AlarmTab>
                <AlarmTab tabLabel='实时告警' {...this.props} params={this._this_Params(1,true)} url={'/app/v2/alarm/list'}>实时告警</AlarmTab>
                <AlarmTab tabLabel='历史告警' {...this.props} params={this._this_Params(2,false)} url={'/app/v2/alarm/list'}>历史告警</AlarmTab>
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
            })
        }
    }

    componentDidMount() {
        // this._getAlarmList();
    }

    _getAlarmList() {
        this.setState({
            isLoading: true
        });
        let url = this.props.url;
        let params=this.props.params;


        // 切换不同标签页，通过tabBle
        // alert(JSON.stringify(url));
        // alert(JSON.stringify(params));

        this.dataRepository.fetchNetRepository('POST',url,params)
            .then(result=>{
                this.setState({
                    result: JSON.stringify(result),
                    dataSource: this.state.dataSource.cloneWithRows(result.data),
                    isLoading: false
                })
            })
    }


    _Time(strTime) {
        let d = new Date();
        d.setTime(strTime);
        let time =`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}  ${d.getHours()}:${d.getMinutes()}`

        // alert(time);

        return  time;
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

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData)
                }}>
                <View style={styles.cell}>
                    <View style={styles.cellLeft}>
                        <Image
                            source={alarmIconSource}/>
                    </View>
                    <View style={styles.cellRight}>
                        <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                            <Text style={{color: '#444444', fontSize: 16}}>{rowData.name}</Text>
                            <Text style={{color: '#7E7E7E', fontSize: 12}}>{this._Time(rowData.reportTime)}</Text>
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
        )
    }

    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: AlarmDetail,
            params: {
                item: rowData,
                ...this.props
            }
        })
    }

    render() {

        let content = <CustomListView
            {...this.props}
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
