/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
    RefreshControl,
    InteractionManager
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinDetail from './BulletinDetail'
import DataRepository from '../../expand/dao/Data';
import NoContentPage from '../../common/NoContentPage';
import NetInfoUtils from '../../util/NetInfoUtils';
import Storage from '../../common/StorageClass';

let storage = new Storage();
let dataRepository = new DataRepository();

// 获取本地用户存储信息
export default class BulletinList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noNetWork: false,
            noData: false,
            isLoading: false,
            theme: this.props.theme,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    /**
     * 获取公告列表数据
     * @private
     */
    _getBulletinList() {
        this.setState({
            isLoading: true // 开启加载动画
        });
        let URL = '/app/v2/notice/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            page: 1,
            size: 20,
        };
        // alert(JSON.stringify(params));
        dataRepository.fetchNetRepository('POST', URL, params).then(result => {
            // alert(JSON.stringify(result));
            if (result.success === true) {

                // mock模拟数据
                let result = {
                    data: new Array(10).join(' ').split(' ').map((v)=> {
                        return {
                            noticeId: "（公告ID【String】",
                            title: "九和路数据中心",
                            abstracts: "摘要内容摘要内容摘要内容摘要内容摘要内容摘" +
                            "要内容摘要内容摘要内容摘要内容摘要内容",
                            time: "2017-02-01 15: 22",
                            read: true
                        }
                    })
                };

                if (!result.data) {
                    this.setState({
                        isLoading: false,
                        noNetWork: false,
                        noData: true,
                    })
                } else {
                    this.setState({
                        result: JSON.stringify(result),
                        dataSource: this.state.dataSource.cloneWithRows(result.data),  // 实时跟新列表数据源
                        isLoading: false,   // 关闭加载动画
                        noData: false,
                    })
                }
            } else {
                this.setState({
                    netWorkError: true,
                })
            }

        }).catch(error => {
            this.setState({
                result: JSON.stringify(error)
            });
        })
    }


    /**
     * 渲染navigationBar左侧按钮
     * @returns {XML}
     * @private
     */
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

    /**
     * 渲染Row内容
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param hightlightRow
     * @returns {XML}
     * @private
     */
    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData);
                }}>
                <View style={styles.cell}>
                    <View style={styles.cellTop}>
                        <View style={styles.cellTopLeft}>
                            {
                                rowData.read
                                    ? <Image source={require('../../../res/Image/Home/ic_home_dot.png')}/>
                                    : null
                            }
                            <Text style={styles.cellTopLeftTitle}>{rowData.title}</Text>
                        </View>
                        <View style={styles.cellTopRight}>
                            <Text style={styles.cellTopRightTime}>{rowData.time}</Text>
                            <Image source={require('../../../res/Image/BaseIcon/ic_listPush_nor.png')}/>
                        </View>


                    </View>
                    <View style={styles.cellBottom}>
                        <Text style={styles.cellBottomText}>{rowData.abstracts}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'公告列表'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;

        // 判断数据是否为空，若为空，返回提示页面,若不为空
        let content =
            this.state.noNetWork
                ? <NoContentPage type='noNetWork'/>
                : this.state.noData
                    ? <NoContentPage type='noData'/>
                    : <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow.bind(this)}
                        refreshControl={
                            <RefreshControl
                                title='加载中...'
                                titleColor={this.state.theme.themeColor}
                                colors={[this.state.theme.themeColor]}
                                tintColor={this.state.theme.themeColor}
                                refreshing={this.state.isLoading}
                                onRefresh={() => {
                                    // 重新获取数据
                                    this._getBulletinList();
                                }}/>
                        }/>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }

    /**
     * 跳转到公告详情页
     * @private
     */
    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: BulletinDetail,
            params: {
                item: rowData,
                ...this.props,
                theme: this.state.theme
            }
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            NetInfoUtils.checkNetworkState((isConnectedNet) => {
                if (isConnectedNet) {
                    this._getBulletinList();
                } else {
                    this.setState({
                        noNetWork: true
                    });
                }
            });
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    cell: {
        marginTop: 4,
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    cellTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cellTopLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellTopLeftTitle: {
        fontSize: 14,
        color: '#444444',
        marginLeft: 12,
    },
    cellTopRight: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellTopRightTime: {
        fontSize: 12,
        color: 'rgba(126,126,126,0.8018568841)'
    },
    cellBottom: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    cellBottomText: {
        fontSize: 12,
        color: '#7E7E7E',
        lineHeight: 19,
    }

});
