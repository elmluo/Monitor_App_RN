/**
 * Created by chenht on 2017/10/26.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import StorageClass from '../../common/StorageClass'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import AlarmFilterSite from './alarmFilterSite'
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/Utils'

let storageClass = new StorageClass();
let {width, height} = Dimensions.get('window')
export default class AlarmFilter extends Component {

    selectedArr = [];
    isSelected = false;
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            selectedArr: []
        }
        let dataRepository = new DataRepository();
        dataRepository.fetchNetRepository('POST', '/app/v2/alarm/condition', {stamp: storageClass.getLoginInfo().stamp}).then(result => {
            if (result.success === true) {
                this.deviceTypeList = result.data.deviceType.map(function (v) {
                    return v.desc;
                });
                this.alarmTypeList = result.data.level;
                this.setState({});
            }
        }).catch(error => {
            // alert(JSON.stringify(error));
        })
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
    _renderRightButton() {
        let scope = this;
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        scope.selectedAlarmLevels.length = 0;
                        scope.selectedDevices.length = 0;
                        scope.setState({});
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Text style={{color: '#FFFFFF'}}>重置</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    deviceTypeList = [];
    alarmTypeList = [];



    // 从外部传入的告警等级的筛选条件。使页面默认选择一种告警
    selectedAlarmLevels = this.props.filter ? (this.props.filter.level || []) : [];

    selectedDevices = this.props.filter ? (this.props.filter.deviceType || []) : []

    render() {
        let scope = this;

        let navigationBar = <NavigationBar
            title={'筛选'}
            style={this.state.theme.styles.navBar}
            leftButton={this._renderLeftButton()}
            rightButton = {this._renderRightButton()}
        />;

        let renderDeviceTypeList = function () {
            let selected = function (d) {
                
            }

            return scope.deviceTypeList.map(function (v, i) {
                return <TouchableOpacity style = {[styles.deviceType, scope.selectedDevices.indexOf(v) > -1 ? {backgroundColor: "rgba(235,235,235,1)"}:{}]}
                    key = {i}
                    activeOpacity={0.5}
                    onPress={() => {
                        onPressHandler(v, 'selectedDevices');
                    }}>
                        <Text style = {{padding: 13, paddingLeft: 16}}>{v}</Text>
                </TouchableOpacity>
            });
        }

        let onPressHandler = function (v, filed) {
            var flag = scope[filed].indexOf(v);

            if (flag === -1) {
                scope[filed].push(v);
            } else {
                scope[filed].splice(flag, 1);
            }

            scope.setState({});            
        }

        let onPressComfirm = function () {
            scope.props.setFilter({
                level: scope.selectedAlarmLevels,
                deviceType: scope.selectedDevices
            })
            scope.props.navigator.pop();
        }

        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={{flex: 1}}>
                    <TouchableOpacity  style={styles.site}
                        activeOpacity={0.5}
                        onPress={() => {
                            scope.props.navigator.push({
                                component: AlarmFilterSite,
                                params: {
                                    ...scope.props
                                }
                            })
                        }}>
                        <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={styles.siteLeft}>
                                <Text style={{lineHeight: 24}}>站点</Text>
                            </View>
                            <View style={styles.siteRight}>
                                <Text numberOfLines = {1} style={{width: 120}}>{'九和路来来来时代峰峻阿'}</Text>                                        
                                <Image
                                    style={{width: 24, height: 24}}
                                    source={require('../../../res/Image/BaseIcon/ic_listPush_nor.png')}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.alarmLevel}>
                        <Text style = {{
                                borderBottomWidth: 2, 
                                borderBottomColor: "#F3F3F3", 
                                marginLeft: 16,
                                paddingTop: 10,
                                paddingBottom: 10
                            }}>告警等级</Text>
                        <View style={{flexDirection: 'row'}}>
                            {scope.alarmTypeList.map(function (v) {

                                return <TouchableOpacity style={[styles.alarmLevelItem, scope.selectedAlarmLevels.indexOf(v.value) > -1 ? {backgroundColor: "rgba(235,235,235,1)"} : {}]}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        onPressHandler(v.value, 'selectedAlarmLevels')
                                    }}>
                                    <Text>{v.desc}</Text>
                                </TouchableOpacity>
                            })}   
                        </View>
                    </View>

                    <View style={styles.alarmLevel}>
                        <Text style = {{
                                borderBottomWidth: 2, 
                                borderBottomColor: "#F3F3F3", 
                                marginLeft: 16,
                                paddingTop: 10,
                                paddingBottom: 10
                            }}>设备类型</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {renderDeviceTypeList()}                            
                        </View>
                    </View>

                </View>
                    
                <TouchableOpacity style = {{backgroundColor: "#FFFFFF"}}
                    activeOpacity={0.5}
                    onPress={onPressComfirm}>
                    <Text style = {{padding: 14, textAlign: 'center', fontSize: 16}}>确定</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    site: {
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    siteLeft: {
        alignItems: 'center',
    },
    siteRight: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    alarmLevel: {
        paddingTop: 13,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        marginTop: 6
    },
    alarmLevelItem: {
        flex: 1,
        padding: 13,
        paddingLeft: 16
    },
    deviceType: {
        width: "50%"
    }

});
