import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    InteractionManager,
    Dimensions,
    Alert,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import CustomListView from '../../common/CustomListView'
import DataRepository from '../../expand/dao/Data'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Storage from '../../common/StorageClass'
import DeviceTab from './SiteDetailDeviceTab'
import LocationPage from './SiteDetailLocationPage';
import BackPressComponent from '../../common/BackPressComponent'

let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRepository = new DataRepository();

export default class SiteDetail extends Component {

    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
        }
    }

    componentDidMount() {
        // android物理返回监听事件
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        // 卸载android物理返回键监听
        this.backPress.componentWillUnmount();
    }

    /**
     * 点击 android 返回键触发
     * @param e 事件对象
     * @returns {boolean}
     */
    onBackPress(e) {
        this.props.navigator.pop();
        return true;
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
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        // alert('还不能打开地图功能');
                        this._pushToLocation()
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_map_nor.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    _pushToLocation() {
        this.props.navigator.push({
            component: LocationPage,
            params: {
                ...this.props
            },
        })
    }

    /**
     * 获取FSU列表
     *
     */
    _getFsuList() {
        let url = '/app/v2/fsu/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            siteId: this.props.siteInfo.siteId,
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            // console.log(result);

        })
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };

        let navigationBar =
            <NavigationBar
                title={this.props.siteInfo.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
                rightButton={this._renderRightButton()}/>;

        let content =
            <ScrollableTabView
                ref='scrollableTabView'
                tabBarUnderlineStyle={{backgroundColor: 'white', height: 2}}
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='#FFFFFF'
                tabBarBackgroundColor={this.state.theme.themeColor}
                initialPage={0} // 默认加载哪一个tab
            >
                <DeviceTab tabLabel='设备'
                           {...this.props}
                           url={'/app/v2/device/list'}
                           params={{
                               stamp: storage.getLoginInfo().stamp,
                               siteId: this.props.siteInfo.siteId,
                               // system: '',
                               // keyword: '',
                               page: 1,
                               size: 20,
                           }}>
                    设备
                </DeviceTab>

                <AlarmTabAlarm tabLabel='告警'
                               {...this.props}
                               url={'/app/v2/alarm/list'}
                               params={{
                                   stamp: storage.getLoginInfo().stamp,
                                   userId: storage.getLoginInfo().userId,
                                   siteId: [this.props.siteInfo.siteId],
                                   // system: '',
                                   // keyword: '',
                                   page: 1,
                                   size: 20,
                                   status: 2,
                               }}>
                    告警
                </AlarmTabAlarm>

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









/**
 * 告警列表ab页面，
 * 充当scrollableTabView的tab页面
 */
import Utils from '../../util/Utils';
import AlarmDetail from '../../page/alarm/AlarmDetail'

class AlarmTabAlarm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * 渲染列表cell
     */
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
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10
                        }}>
                            <Text style={{color: '#444444', fontSize: 16}}>{rowData.name}</Text>
                            <Text style={{color: '#7E7E7E', fontSize: 12}}>{Utils.FormatTime(new Date(rowData.reportTime), 'yyyy-MM-dd hh:mm')}</Text>
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
        return (
            <View style={{flex: 1}}>
                <CustomListView
                    {...this.props}
                    url={this.props.url}
                    params={this.props.params}
                    alertText={'没有更多数据了~'}
                    // bind(this)机制需要熟悉
                    renderRow={this._renderRow.bind(this)}/>
            </View>
        )
    }
}




