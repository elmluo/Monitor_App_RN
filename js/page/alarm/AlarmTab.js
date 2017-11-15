import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    Dimensions,
} from 'react-native';
import AlarmDetail from './AlarmDetail'
import CustomListViewForAlarm from '../../common/CustomListViewForAlarm'
import CustomListViewForFocusAlarm from '../../common/CustomListViewForFocusAlarm'
import Utils from '../../util/Utils'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'
import Toast from 'react-native-easy-toast'

let {width, height} = Dimensions.get('window');
import LoadingView from '../../common/LoadingView'

let storage = new Storage();
// 根据不同的用户，保存不同本地的关注列表，添加不同的key。
/**
 * 封装一个单独的组件类，
 * 充当scrollableTabView的tab页面
 */
export default class AlarmTab extends Component {

    constructor(props) {
        super(props);
        this.focusKey = 'focus_alarm_list' + storage.getLoginInfo().userId;
        this.dataRepository = new DataRepository();
        this.state = {
            hisArr: [],
            isLoading: false,
            visible: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
        }
    }

    componentDidMount() {
        // DeviceEventEmitter.emit('custom_listView_alarm');

        // 获取AsyncStorage本地数据
        this.dataRepository.fetchLocalRepository(this.focusKey).then((result) => {
            if (!!result) {
                this.setState({hisArr: result})
            } else {
                this.setState({hisArr: []})
            }
            // console.log(result);
        });

        /**
         * 每次父组件切换tab页面
         *      从后台重新获取告警已关注列表
         *      更新本地已关注告警列表
         *      获取本地已关注告警列表到组件状态机。
         */
        this.listener = DeviceEventEmitter.addListener('get_focus_alarm_list', () => {
            this.getFocusedList();
            this.dataRepository.fetchLocalRepository(this.focusKey).then((result) => {
                if (!!result) {
                    this.setState({hisArr: result})
                } else {
                    this.setState({hisArr: []})
                }
                // console.log(result);
            });
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    /**
     * 判断选告警是否在关注告警本地数组中
     * @param alarmId
     * @param hisArr
     * @returns {boolean}
     */
    alarmInAlarms(alarmId, hisArr) {
        return hisArr.indexOf(alarmId) !== -1;
    }

    /**
     * 获取服务端已关注告警数据列表
     *  重新更新本地已关注数据列表
     */
    getFocusedList() {
        let url = '/app/v2/alarm/focus/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            size: 50,
            page: 1,
        };
        this.dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            let arr = result.data.map((v, i, arr) => {
                return v.alarmId
            });
            this.dataRepository.saveRepository(this.focusKey, arr);
        })
    };

    _postSelectedAlarm(rowData) {
        this.setState({
            visible: true,
        });
        let url = '/app/v2/alarm/focus/change';
        let params = {
            userId: storage.getLoginInfo().userId,
            stamp: storage.getLoginInfo().stamp,
            alarmId: rowData.alarmId,
        };
        // 切换不同标签页，通过tabBle
        this.dataRepository.fetchNetRepository('POST', url, params)
            .then(result => {
                // console.log(result);
                this.setState({
                    visible: false,
                });
                if (result.success === true) {
                    this.refs.toast.show(result.info);
                    this.setState({});
                    if (this.alarmInAlarms(rowData.alarmId, this.state.hisArr)) {
                        this.state.hisArr.splice(this.state.hisArr.indexOf(rowData.alarmId), 1);
                        this.dataRepository.saveRepository(this.focusKey, this.state.hisArr);
                    } else {
                        this.state.hisArr.push(rowData.alarmId);
                        this.dataRepository.saveRepository(this.focusKey, this.state.hisArr);
                    }
                    // 发送通知，改变listView数据源，重新刷新
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        // 如果是关注告警列表，点击'关注'重新刷新，否则更新listView
                        if (this.props.isFocusAlarm) {
                            DeviceEventEmitter.emit('refresh_focus_alarm');
                            DeviceEventEmitter.emit('custom_listView_alarm');
                        } else {
                            DeviceEventEmitter.emit('custom_listView_alarm_update');
                            DeviceEventEmitter.emit('refresh_focus_alarm');
                        }

                    }, 0);
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
                                <Text numberOfLines={1}
                                      style={{color: '#444444', fontSize: 16, width: width * 0.4}}>{rowData.name}</Text>
                                <Text style={{
                                    color: '#7E7E7E',
                                    fontSize: 12
                                }}>{Utils.FormatTime(new Date(rowData.reportTime), 'yyyy-MM-dd hh:mm')}</Text>
                            </View>
                            <View>
                                <Text numberOfLines={1} style={{
                                    color: '#7E7E7E',
                                    fontSize: 14,
                                    width: width * 0.4
                                }}>{rowData.siteName}</Text>
                            </View>
                            <View>
                                <Text style={{color: '#7E7E7E', fontSize: 14}}>{rowData.deviceName}</Text>
                            </View>

                        </View>
                    </View>

                </TouchableOpacity>


                <View style={{position: 'absolute', right: 10, bottom: 10}}>
                    {!this.props.isAlarm ?
                        <TouchableOpacity onPress={() => {
                            this._postSelectedAlarm(rowData);
                        }}>
                            <View style={{width: 100, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                {
                                    this.alarmInAlarms(rowData.alarmId, this.state.hisArr)
                                        ? <View style={{
                                            width: 100,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Image style={{width: 10, height: 10}}
                                                   source={require('../../../res/Image/Alarm/ic_focus_selected.png')}/>
                                            <Text style={{left: 5, fontSize: 12, color: 'rgb(126,126,126)'}}>已关注</Text>
                                        </View>
                                        : <View style={{
                                            width: 100,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            backgroundColor: 'rgba(0,0,0,0)'
                                        }}>
                                            <Image style={{width: 10, height: 10}}
                                                   source={require('../../../res/Image/Alarm/ic_focus_nor.png')}/>
                                            <Text style={{left: 5, fontSize: 12, color: 'rgb(126,126,126)'}}>未关注</Text>
                                        </View>
                                }
                            </View>
                        </TouchableOpacity>
                        : <View></View>
                    }
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
        let content = !!this.props.isFocusAlarm ?
            <CustomListViewForFocusAlarm
                {...this.props}
                noDataType={'noAlarm'}
                url={this.props.url}
                params={{...this.props.params}}
                renderRow={this._renderRow.bind(this)}
                alertText={'没有更多数据了~'}
            />
            : <CustomListViewForAlarm
                {...this.props}
                noDataType={'noAlarm'}
                url={this.props.url}
                params={{...this.props.params}}
                renderRow={this._renderRow.bind(this)}   // bind(this)机制需要熟悉
                alertText={'没有更多数据了~'}
            />;
        return (
            <View style={styles.container}>
                {content}
                <LoadingView showLoading={this.state.visible}/>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                    position='bottom'
                    positionValue={300}
                    fadeInDuration={0}
                    fadeOutDuration={0}
                    opacity={0.8}
                    textStyle={{color: '#000000'}}
                />
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