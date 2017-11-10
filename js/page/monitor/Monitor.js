/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    InteractionManager,
    Dimensions,
} from 'react-native'
import SearchPage from '../SearchPage'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import SiteDetail from './SiteDetail'
import Storage from '../../common/StorageClass'
import CustomListView from '../../common/CustomListView'
import Searchbox from '../../common/Searchbox'


let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRepository = new DataRepository();

export default class Monitor extends Component {

    url = '/app/v2/site/model/list';

    params = {
        stamp: storage.getLoginInfo().stamp,
        page: 1,
        size: 20,
    };

    constructor(props) {
        super(props);
        // 初始化类实例
        this.state = {
            noNetWork: false,
            noData: false,
            isLoading: false,
            theme: this.props.theme,
        }
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
        let fsuOnline =
            rowData.fsuOnline ? <View style={[styles.onlineState, {backgroundColor: '#3C7FFC'}]}><Text
                    style={styles.operationStateText}>在线</Text></View>
                : <View style={styles.onlineState}><Text style={styles.operationStateText}>离线</Text></View>;

        let operationState;
        if (rowData.operationState === '工程态') {
            operationState = <View style={[styles.operationState, {backgroundColor: 'rgb(141, 135, 179)'}]}>
                <Text style={styles.operationStateText}>工程态</Text>
            </View>
        } else if (rowData.operationState === '测试态') {
            operationState = <View style={[styles.operationState, {backgroundColor: 'rgb(136, 121, 232)'}]}>
                <Text style={styles.operationStateText}>测试态</Text>
            </View>
        } else if (rowData.operationState === '交维态') {
            operationState = <View style={[styles.operationState, {backgroundColor: 'rgb(107, 92, 245)'}]}>
                <Text style={styles.operationStateText}>交维态</Text>
            </View>
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData);
                }}>
                <View style={styles.row}>
                    <View style={styles.rowTop}>
                        <Text numberOfLines={1} style={styles.name}>{rowData.name}</Text>
                        <View style={styles.rowTopRight}>
                            <Text style={styles.rowTopRightText}>设备数量：</Text>
                            <Text style={styles.rowTopRightText}>{rowData.deviceCount ? rowData.deviceCount : 0}</Text>
                        </View>
                    </View>
                    <View style={styles.rowBottom}>
                        <Text style={styles.tier}>{rowData.tier}</Text>
                        <View style={styles.rowBottomRight}>
                            {operationState}
                            {fsuOnline}
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
                siteInfo: rowData,
                ...this.props
            },
        })
    }

    _pushToSearchPage() {
        this.props.navigator.push({
            component: SearchPage,
            params: {
                title: '请输入站点名称',
                hisArr: 'site_hisArr_monitor',
                url: this.url,
                params: this.params,
                renderRow: this._renderRow.bind(this),
                ...this.props
            }
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
            <CustomListView
                {...this.props}
                url={this.url}
                params={this.params}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}
                // renderHeader={this._renderHeader.bind(this)}
                alertText={'没有更多数据了~'}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.searchBoxWrapper}>
                    <Searchbox
                        placeholder={'请输入站点名称'}
                        onClick={() => {
                            this._pushToSearchPage();
                        }}
                    />
                </View>

                {content}
            </View>
        )
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBoxWrapper: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 6,
        backgroundColor: '#FFFFFF'
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        backgroundColor: '#FFFFFF',
        paddingLeft: 16,
        padding: 15,
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
        fontSize: 14,
        width: width * 0.55
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
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    operationState: {
        backgroundColor: '#949494',
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    operationStateText: {
        color: '#FFFFFF',
        fontSize: 12,
    }

});
