/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    InteractionManager,
    Dimensions,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import CustomListView from '../../common/CustomListView'
import DataRepository from '../../expand/dao/Data'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Searchbox from '../../common/Searchbox'
import Storage from '../../common/StorageClass'
let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRepository = new DataRepository();
export default class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
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
                        alert('还不能打开地图功能')
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

    /**
     * 获取FSU列表
     *
     */
    _getFsuList() {
        let url = '/app/v2/fsu/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            siteId: this.props.item.siteId,
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            console.log(result);
        })
    }

    /**
     * 获取设备系统分类列表
     */
    _getSystemList() {
        let url = '/app/v2/device/system/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            siteId: this.props.item.siteId
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            console.log(result);
        })
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };

        let navigationBar =
            <NavigationBar
                title={this.props.item.name}
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
                <AlarmTabDevice tabLabel='设备'
                                {...this.props}
                                url={'/app/v2/device/list'}
                                params={{
                                    stamp: storage.getLoginInfo().stamp,
                                    siteId: this.props.item.siteId,
                                    // system: '',
                                    // keyword: '',
                                    page: 1,
                                    size: 20,
                                }}>
                    设备
                </AlarmTabDevice>
                <AlarmTabAlarm tabLabel='告警'
                               {...this.props}
                               url={'/app/v2/alarm/list'}
                               params={{
                                   stamp: storage.getLoginInfo().stamp,
                                   userId: storage.getLoginInfo().userId,
                                   siteId: [this.props.item.siteId],
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

    componentDidMount() {

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
 * 设备列表tab页面，
 * 充当scrollableTabView的tab页面
 */

import SearchPage from '../../page/SearchPage';
class AlarmTabDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * 更具typeCode，
     * @param typeCode
     * @returns {string}
     * @private
     */
    _getImageIcon(typeCode) {
        let imageIcon;
        switch (typeCode) {
            case '002':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_GGD_nor.png")}/>;
                break;
            case '006':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SMPS_nor.png")}/>;
                break;
            case '007':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_BATT_nor.png")}/>;
                break;
            case '008':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_UPS_nor.png")}/>;
                break;
            case '015':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Conditioners_nor.png")}/>;
                break;
            case '016':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SmartMeter_nor.png")}/>;
                break;
            case '099':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_RKE_nor.png")}/>;
                break;
            case '100':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Cameras_nor.png")}/>;
                break;
            case '107':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SMPS_nor.png")}/>;
                break;
            case '181':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Infrared_nor.png")}/>;
                break;
            case '182':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SmokeDetector_nor.png")}/>;
                break;
            case '183':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_THTB_nor.png")}/>;
                break;
            case '184':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_YDN_WDT_nor.png")}/>;
                break;
            case '185':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_EN_MG_nor.png")}/>;
                break;
            default:
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_XX_nor.png")}/>;
        }
        return imageIcon
    }

    /**
     * 渲染列表cell
     */
    _renderRow(rowData) {
        return (
            <View style={deviceCellStyles.cell}>

                <View style={deviceCellStyles.cellLeft}>

                    <View>
                        {this._getImageIcon(rowData.typeCode)}
                    </View>

                    <View>
                        <Text style={{fontSize: 14, color: '#444444', paddingLeft: 16}}>{rowData.name}</Text>
                    </View>

                </View>

                <View>
                    {/*{fusOnline}*/}
                </View>
            </View>

        )
    }

    /**
     * 跳转到搜索页面
     * @private
     */
    _pushToSearchPage() {
        this.props.navigator.push({
            component: SearchPage,
            params: {
                title: '请输入设备名称',
                url: this.props.url,
                params: this.props.params,
                renderRow: this._renderRow.bind(this),
                ...this.props
            }
        })
    }

    render() {
        let header =
            <View style={deviceCellStyles.searchHeader}>
                <View>
                    <Text>设备系统选择</Text>
                </View>
                <View style={{width: width * 0.65}}>
                    <Searchbox
                        {...this.props}
                        onClick={() => {
                            this._pushToSearchPage();
                        }}
                        placeholder={'请输入设备名称'}/>
                </View>
            </View>;
        let list =
            <CustomListView
                {...this.props}
                url={this.props.url}
                params={this.props.params}
                alertText={'没有更多数据了~'}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}/>;

        return (
            <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
                {header}
                {list}
            </View>
        )
    }
}

const deviceCellStyles = StyleSheet.create({
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 6
    },
    cell: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 4,
    },
    onlineState: {
        backgroundColor: '#949494',
        color: '#FFFFFF',
        fontSize: 12,
        // paddingTop: 1,
        // paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
                        <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
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




