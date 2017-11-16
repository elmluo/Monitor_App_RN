import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    RefreshControl,
    Alert,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'
import Utils from '../../util/Utils'
import AIChart from './AIChart'
import BackPressComponent from '../../common/BackPressComponent'

let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRespository = new DataRepository();
export default class SiteDetailSignalAI extends React.Component {

    // ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
            signalHistoryList: [],
            isLoading: false,
            data: {data:[]},
            // 初始化列表状态机对象
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
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
                        this.props.navigator.pop();
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _getSignalHistoryList() {
        this.setState({
            isLoading: true,
        });
        let url = '/app/v2/signal/history/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            signalId: this.props.signal.signalId,
            size: 20,
        };

        dataRespository.fetchNetRepository('POST', url, params).then((result) => {
            // alert(JSON.stringify(result));
            if (result.success === true) {
                this.setState({
                    isLoading: false,
                });
                this.setState({
                    data: result,
                    dataSource: this.state.dataSource.cloneWithRows(result.data.reverse()),
                })
            }

        })
    }

    _renderHeader() {
        return (
            <View style={styles.listHeader}>
                <Text>我是头部</Text>
            </View>
        )
    }

    _renderRow(v, i) {
        return (
            <View key={i} style={styles.cellWrapper}>
                <View style={styles.cell}>
                    <Text style={styles.cellLeft}>{Utils.FormatTime(new Date(v.time),'yyyy-MM-dd hh:mm')}</Text>
                    <Text style={styles.cellRight}>{v.value + '' + this.props.signal.unit}</Text>
                </View>
            </View>
        )
    }

    _renderListView() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                // renderHeader={this._renderHeader.bind(this)}
                renderRow={this._renderRow.bind(this)}/>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={this.props.signal.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        let content = this._renderListView();

        return (
            <View style={styles.container}>
                {navigationBar}
                <View
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
                                this._getSignalHistoryList();
                            }}
                            tintColor={this.props.theme.themeColor}/>
                    }>
                    <View style={styles.top}>
                        <View style={styles.topChart}>
                            {/*图表组件*/}
                            <AIChart
                                {...this.props}
                                unit={this.props.signal.unit}
                                chartData={this.state.data}
                                width={width}
                                height={height * 0.35}
                            />
                        </View>
                    </View>
                    <View style={styles.topTitle}>
                        <Text style={styles.topTitleText}>采集时间</Text>
                        <Text style={styles.topTitleText}>数据</Text>
                    </View>
                    <View style={styles.bottom}>
                        {content}
                    </View>
                </View>

            </View>
        )
    }

    componentDidMount() {
        this._getSignalHistoryList();
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    top: {
        height: height * 0.37,
        backgroundColor: '#F3F3F3'
    },
    topChart: {},
    topTitle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: height* 0.06,
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 4
    },
    topTitleText: {
        fontSize: 16,
        color: '#7E7E7E'
    },
    bottom: {
        height: height * 0.43
    },
    cellWrapper: {
        paddingLeft: 16,
        paddingRight: 16,
        // backgroundColor: 'red'
    },
    cell: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        paddingTop: 16,
        paddingBottom: 10,
    },
    cellLeft: {
        color: '#444444',
        fontSize: 14
    },
    cellRight: {
        color: '#444444',
        fontSize: 14
    }
});