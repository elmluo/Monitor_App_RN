import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    TouchableOpacity,
    Image,
    DeviceEventEmitter
} from 'react-native';
import AlarmDetail from './AlarmDetail'
import CustomListViewForAlarm from '../../common/CustomListViewForAlarm'
import Utils from '../../util/Utils'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'

let storage = new Storage();
/**
 * 封装一个单独的组件类，
 * 充当scrollableTabView的tab页面
 */
export default class AlarmTab extends Component {


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
                    this.setState({
                        url: this.props.url,
                    });

                    // 发送通知，自定义列表刷新
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        DeviceEventEmitter.emit('custom_listView_alarm');
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
                    {!this.props.isAlarm ?
                        <TouchableOpacity onPress={() => {
                            this._postSelectedAlarm(rowData.alarmId);
                        }}>
                            <View style={{width: 100, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                {
                                    rowData.focus
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
        // this.props.params.level = ['2', '1'];
        // this.props.params.siteId = ['57abe9d355545eeda80722e5']
        let content =
            <CustomListViewForAlarm
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