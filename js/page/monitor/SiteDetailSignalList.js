import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ListView,
    Alert,
    Button,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import CustomListView from '../../common/CustomListView'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'
import Utils from '../../util/Utils';
import SiteDetailSignalAI from './SiteDetailSignalAI'
import BackPressComponent from '../../common/BackPressComponent'

let {width, height} = Dimensions.get('window');
let dataRepository = new DataRepository();
let storage = new Storage();
export default class SignalList extends React.Component {
    selectArr = [];
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
            signalList: [],
        };
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
                        this.props.navigator.pop()
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                        {/*<Text>个人</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _getSignalList() {
        let url = '/app/v2/signal/realtime/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            deviceId: this.props.deviceInfo.deviceId,
        };
        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            console.log(result);
            // dataModel: name, signalId, techType, threshold, time, unit, value
            if (result.success === true) {
                this.setState({
                    signalList: result.data,
                })
            }
        })


    }

    _pushToSiteDetailSignalAI(v) {
        this.props.navigator.push({
            component: SiteDetailSignalAI,
            params: {
                signal: v,
                ...this.props
            }
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
    _renderCell(v, i) {
        console.log(v);
        if (v.techType === "遥测") {
            let value;

            // 空调设备较为特殊，后台返回数据可能和遥测对不上。
            if (v.unit === '%RH') {
                value = <View>
                    <Text style={styles.cellLeftImageBgText}>{v.value}</Text>
                    <Text style={styles.cellLeftImageBgText}>{v.unit}</Text>
                </View>
            } else {
                value = <View>
                    <Text style={styles.cellLeftImageBgText}>{v.value + '' + v.unit}</Text>
                </View>
            }

            return (
                <TouchableOpacity
                    onPress={() => {
                        this._pushToSiteDetailSignalAI(v);
                    }}>
                    <View key={i} style={styles.cell}>
                        <View style={styles.cellLeft}>
                            <ImageBackground
                                style={styles.cellLeftImageBg}
                                source={require('../../../res/Image/Monitor/ic_single_nor.png')}>
                                {value}
                            </ImageBackground>
                            <View style={styles.celLeftText}>
                                <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                                <Text style={styles.cellLeftSubTitle}>{Utils._Time(v.time)}</Text>
                            </View>
                        </View>
                        <View style={styles.cellRight}>
                            <Image
                                style={styles.cellRightImage}
                                source={require('../../../res/Image/BaseIcon/ic_push_nor.png')}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (v.techType === "遥信") {
            if (v.value === 0) {
                let clickView;
                if ('1' !== JSON.stringify(v.threshold)) {
                    clickView =
                        <TouchableOpacity
                            style={styles.clickView}
                            onPress={() => {

                                // 点击显示遥信的门限值
                                let result = this.selectArr.indexOf(v.threshold) !== -1;    // 内容是否在数组中
                                if (result) {
                                    this.selectArr.splice(this.selectArr.indexOf(v.threshold), 1);
                                } else {
                                    this.selectArr.push(v.threshold);
                                }
                                this.setState({})   // 触发视图刷新

                            }}>
                        </TouchableOpacity>
                } else {
                    clickView = null;
                }
                return (
                    <View key={i} style={styles.cell}>
                        {clickView}
                        <View style={styles.cellLeft}>
                            <ImageBackground
                                style={styles.cellLeftImageBg}
                                source={require('../../../res/Image/Monitor/ic_single_nor.png')}>
                                <Text style={styles.cellLeftImageBgText}>
                                    {
                                        this.selectArr.indexOf(v.threshold) !== -1
                                            ? v.threshold :'正常'
                                    }
                                </Text>

                            </ImageBackground>
                            <View style={styles.celLeftText}>
                                <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                                <Text style={styles.cellLeftSubTitle}>{Utils._Time(v.time)}</Text>
                            </View>
                        </View>
                        <View style={styles.cellRight}>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View key={i} style={styles.cell}>
                        <View style={styles.cellLeft}>
                            <ImageBackground
                                style={styles.cellLeftImageBg}
                                source={require('../../../res/Image/Monitor/ic_single_alarm.png')}>
                                <Text style={styles.cellLeftImageBgText}>告警</Text>
                            </ImageBackground>
                            <View style={styles.celLeftText}>
                                <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                                <Text style={styles.cellLeftSubTitle}>{Utils._Time(v.time)}</Text>
                            </View>
                        </View>
                        <View style={styles.cellRight}>
                            {/*<Text>向右箭头</Text>*/}
                        </View>
                    </View>
                )
            }
        } else {
            return <Text>12345</Text>
        }
    }


    _renderScrollView() {
        // console.log(params.page,233333);
        return (
            <ScrollView style={styles.scrollView}>
                {this.state.signalList.map((v, i, arr) => {
                    return this._renderCell(v, i)
                })}
            </ScrollView>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={this.props.deviceInfo.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        let scrollView = this._renderScrollView();
        return (
            <View style={styles.container}>
                {navigationBar}
                {scrollView}
            </View>
        )
    }

    componentDidMount() {
        this._getSignalList();
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    scrollView: {
        backgroundColor: '#F3F3F3',
    },
    cell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 4,
        position: 'relative'
    },
    clickView: {
        position: 'absolute',
        left: 16,
        width: 50,
        height: 50,
        // backgroundColor: 'red',
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cellLeftImageBg: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        marginRight: 16,
    },
    cellLeftImageBgText: {
        // backgroundColor: 'red',
        backgroundColor: 'transparent',
        color: '#7E7E7E',
        fontSize: 12,
    },
    celLeftText: {},
    cellLeftTitle: {
        fontSize: 17,
        width: width * 0.6,
        color: '#444444',
    },
    cellLeftSubTitle: {
        color: '#7E7E7E',
        fontSize: 12,
        marginTop: 6
    },
    cellRight: {},
    cellRightImage: {
        width: 24,
        height: 24,
        tintColor: '#7E7E7E',
        // backgroundColor: 'red'
    }
});