/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import SiteDetail from './SiteDetail'
// import DataRepository from '../../expand/dao/DataRepository'

export default class Monitor extends Component {
    constructor(props) {
        super(props);
        // 初始化类实例
        this.dataRepository = new DataRepository();
        this.state = {
            isLoading: false,
            theme:this.props.theme,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
        }
    }

    _onLoad() {
        // 开启加载动画
        this.setState({
           isLoading: true
        });
        let url = '/app/v2/site/model/list';
        let params = {
            stamp: 'Skongtrolink',
            page: 1,
            size: 20,
        };
        this.dataRepository.fetchNetRepository('POST',url, params)
            .then(result=>{
                this.setState({
                    result: JSON.stringify(result),   // 实时跟新列表数据源
                    dataSource: this.state.dataSource.cloneWithRows(result.data),
                    isLoading: false   // 关闭加载动画
                })
            })
            .catch(error=> {
                this.setState({
                    result: JSON.stringify(error)
                });
            })
    }

    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        let fusState =
            rowData.fsuOnline
                ?<Text>在线</Text>
                :<Text>离线</Text>;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData)
                }}>
                <View style={styles.row}>
                    <View style={styles.rowTop}>
                        <Text style={styles.rowTopTitle}>{rowData.name}</Text>
                        <Text>设备数量： {rowData.deviceCount}</Text>
                    </View>
                    <View style={styles.rowBottom}>
                        {fusState}
                        <Text>{rowData.tier}</Text>
                    </View>
                </View>

            </TouchableOpacity>

        )
    }

    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: SiteDetail,
            title: rowData.name,
            passProps: {rowData}
        })
    }
    componentDidMount() {
        // 组件装载完，获取数据
        this._onLoad()
    }
    
    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'监控页面'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>;
        return(
            <View style={styles.container}>
                {navigationBar}
                <Text>{this.state.result}</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    refreshControl={
                        <RefreshControl
                            title='加载中...'
                            titleColor={this.state.theme.themeColor}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            refreshing={this.state.isLoading}
                            onRefresh={()=>{
                                // 刷新的时候重新获取数据
                                this._onLoad()
                            }}/>
                    }/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        marginLeft: 16,
        padding: 16
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    online: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12
    }

});
