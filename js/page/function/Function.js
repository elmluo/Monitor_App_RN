/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'

let {width, height} = Dimensions.get('window');
let dataRepository = new DataRepository();
let storage = new Storage();
export default class Function extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,

        }
    }


    _IconView(icon, text, marginTop) {
        let viewWidth = width / 3;
        let iconView = <TouchableOpacity onPress={() => {
            Alert.alert(
                '此功能暂未开放',
                '',
                [
                    {text: '确定', onPress: () => {}},
                ],
                { cancelable: false }
            )
        }}>
            <View style={{marginTop: marginTop ? marginTop : 25, width: viewWidth, alignItems: 'center'}}>
                <Image source={icon}/>
                <Text style={{marginTop: 10, color: 'rgb(126,126,126)'}}>{text}</Text>
            </View>
        </TouchableOpacity>;

        return iconView;

    }

    /**
     * 刷新获取所有数据
     * @private
     */
    _refreshData() {
        return new Promise((resolve, reject) => {
            let URL = '/app/v2/service/list';
            let params = {
                stamp: storage.getLoginInfo().stamp,
            };
            dataRepository.fetchNetRepository('POST', URL, params).then(result => {


                if (result.success === true) {
                    this.setState({
                        isLoading: false,
                    })
                }

            }, (error) => {
                reject(error);
            })
        })
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'服务页'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>;
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

                <View style={{backgroundColor: 'white', width: width, height: 40, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: 'rgb(126,126,126)', left: 16}}> 系统服务</Text>
                </View>
                <View style={styles.line}/>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    width: width,
                    height: height * 0.37,
                    flexWrap: 'wrap'
                }}>
                    {this._IconView(require('../../../res/Image/Subsystem/subsystem_battery_Dis.png'), '蓄电池')}
                    {this._IconView(require('../../../res/Image/Subsystem/subsystem_door_Dis.png'), '门禁系统')}
                    {this._IconView(require('../../../res/Image/Subsystem/subsystem_battery_Dis.png'), '监控系统')}
                    {this._IconView(require('../../../res/Image/Subsystem/subsystem_energy_Dis.png'), '能耗系统', 40)}
                    {this._IconView(require('../../../res/Image/Subsystem/subsystem_airCondition_Dis.png'), '空调系统', 40)}
                </View>
                <View style={{backgroundColor: 'white', width: width, height: 40, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: 'rgb(126,126,126)', left: 16}}> 功能服务</Text>
                </View>
                <View style={styles.line}/>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    width: width,
                    height: height * 0.2,
                    flexWrap: 'wrap'
                }}>
                    {this._IconView(require('../../../res/Image/Subsystem/function_ereport_Dis.png'), '功能报表')}
                    {this._IconView(require('../../../res/Image/Subsystem/function_alarm_Dis.png'), '告警联动')}
                    {this._IconView(require('../../../res/Image/Subsystem/function_task_Dis.png'), '定时任务')}
                </View>
            </ScrollView>;
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
        backgroundColor: 'rgb(243,243,243)'
    },
    line: {
        height: 2,
        backgroundColor: 'rgba(235,235,235,1)',
    },
});
