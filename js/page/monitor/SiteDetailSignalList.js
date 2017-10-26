import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ListView,
    Alert,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import CustomListView from '../../common/CustomListView'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'

let {width, height} = Dimensions.get('window');
let dataRepository = new DataRepository();
let storage = new Storage();
export default class SignalList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            signalList: [],
        };
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

    _renderCell(v,i) {
        if (v.techType === "遥测") {
            return (
                <View key={i} style={styles.cell}>
                    <View style={styles.cellLeft}>
                        <ImageBackground
                            style={styles.cellLeftImageBg}
                            source={require('../../../res/Image/Monitor/ic_single_nor.png')}>
                        </ImageBackground>
                        <View style={styles.celLeftText}>
                            <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                            <Text style={styles.cellLeftSubTitle}>{v.time}</Text>
                        </View>
                    </View>
                    <View style={styles.cellRight}>
                        <Text>向右箭头</Text>
                    </View>
                </View>

            )
        } else if(v.techType === "遥信"){
            if (v.value === 0) {
                return (
                    <View key={i} style={styles.cell}>
                        <View style={styles.cellLeft}>
                            <ImageBackground
                                style={styles.cellLeftImageBg}
                                source={require('../../../res/Image/Monitor/ic_single_nor.png')}>
                            </ImageBackground>
                            <View style={styles.celLeftText}>
                                <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                                <Text style={styles.cellLeftSubTitle}>{v.time}</Text>
                            </View>
                        </View>
                        <View style={styles.cellRight}>
                            <Text>向右箭头</Text>
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
                            </ImageBackground>
                            <View style={styles.celLeftText}>
                                <Text numberOfLines={1} style={styles.cellLeftTitle}>{v.name}</Text>
                                <Text style={styles.cellLeftSubTitle}>{v.time}</Text>
                            </View>
                        </View>
                        <View style={styles.cellRight}>
                            <Text>向右箭头</Text>
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
        marginBottom: 4
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cellLeftImageBg: {
        width: 46,
        height: 46,
        marginRight: 16
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
    cellRight: {}
});