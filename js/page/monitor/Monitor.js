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
    TouchableOpacity,
    InteractionManager
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import SiteDetail from './SiteDetail'
import NetInfoUtils from '../../util/NetInfoUtils'
import Storage from '../../common/StorageClass'
import NoContentPage from '../../common/NoContentPage'

let storage = new Storage();

export default class Monitor extends Component {
    constructor(props) {
        super(props);
        // 初始化类实例
        this.dataRepository = new DataRepository();
        this.state = {
            noNetWork: false,
            noData: false,
            isLoading: false,
            theme: this.props.theme,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    /***
     * 获取站点列表
     * @private
     */
    _getSiteList() {
        // 开启加载动画
        this.setState({
            isLoading: true
        });
        let url = '/app/v2/site/model/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            page: 1,
            size: 20,
        };
        this.dataRepository.fetchNetRepository('POST', url, params).then(result => {
            if (result.success === true) {

                if (!result.data || result.data.length === 0) {
                    this.setState({
                        isLoading: false,
                        noNetWord: false,
                        noData: true
                    })
                } else {
                    console.log(JSON.stringify(result));
                    this.setState({
                        result: JSON.stringify(result),
                        dataSource: this.state.dataSource.cloneWithRows(result.data),
                        isLoading: false,
                        noData: false,
                    })
                }
            } else {
                console.log('连接服务失败')
            }
        }).catch(error => {
            this.setState({
                result: JSON.stringify(error)
            });
        })
    }

    /**
     * 渲染cell
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param hightlightRow
     * @returns {XML}
     * @private
     */
    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        let onlineStyle = {
            backgroundColor: this.state.theme.themeColor,
        };
        let fusOnline =
            rowData.fsuOnline ? <Text style={[styles.onlineState, onlineStyle]}>在线</Text>
                : <Text style={styles.onlineState}>离线</Text>;

        let operationState;
        if (rowData.operationState === '工程态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(141, 135, 179)'}]}>工程态</Text>
        } else if (rowData.operationState === '测试态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(136, 121, 232)'}]}>测试态</Text>
        } else if (rowData.operationState === '交维态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(107, 92, 245)'}]}>交维态</Text>
        }

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData)
                }}>
                <View style={styles.row}>
                    <View style={styles.rowTop}>
                        <Text style={styles.name}>{rowData.name}</Text>
                        <View style={styles.rowTopRight}>
                            <Text style={styles.rowTopRightText}>设备数量：</Text>
                            <Text style={styles.rowTopRightText}>{rowData.deviceCount? rowData.deviceCount: 0}</Text>
                        </View>
                    </View>
                    <View style={styles.rowBottom}>
                        <Text style={styles.tier}>{rowData.tier}</Text>
                        <View style={styles.rowBottomRight}>
                            {operationState}
                            {fusOnline}
                        </View>
                    </View>
                </View>

            </TouchableOpacity>

        )
    }

    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: SiteDetail,
            params: {
                item: rowData,
                ...this.props
            },
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            NetInfoUtils.checkNetworkState((isConnectedNet) => {
                if (isConnectedNet) {
                    this._getSiteList();
                } else {
                    this.setState({
                        noNetWork: true
                    });
                }
            });
        });

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
        let content =
            this.state.noNetWork ? <NoContentPage type='noNetWork'/>
                : this.state.noData ? <NoContentPage type='noData'/> : <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    onEndReachedThreshold={50}
                    onEndReached={()=> {
                        alert('到底了');

                        this._getSiteList()

                    }}
                    refreshControl={
                        <RefreshControl
                            title='加载中...'
                            titleColor={this.state.theme.themeColor}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            refreshing={this.state.isLoading}
                            onRefresh={() => {
                                // 刷新的时候重新获取数据
                                this._getSiteList();
                            }}/>
                    }/>


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
    row: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        marginLeft: 16,
        padding: 15,
        paddingLeft: 0,
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7
    },
    rowTopRight: {
        width: 90,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    name: {
        color: '#444444',
        fontSize: 14
    },
    rowTopRightText: {
        color: '#7E7E7E',
        fontSize: 12,
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBottomRight: {
        flexDirection: 'row'
    },
    tier: {
        fontSize: 12,
        color: '#7E7E7E',
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
    operationState: {
        backgroundColor: '#949494',
        color: '#FFFFFF',
        fontSize: 12,
        // paddingTop: 1,
        // paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
        marginRight: 4,
    }

});
