/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    InteractionManager
} from 'react-native'
import DataRepository from '../expand/dao/Data'
import NetInfoUtils from '../util/NetInfoUtils'
import Storage from '../common/StorageClass'
import NoContentPage from '../common/NoContentPage'
import Toast, {DURATION} from 'react-native-easy-toast';

let storage = new Storage();

export default class CustomListView extends Component {
    constructor(props) {
        super(props);
        // 初始化类实例
        this.dataRepository = new DataRepository();
        this.page = 1;
        this._data = [];
        this.state = {
            noNetWork: false,
            noData: false,
            isLoading: false,
            theme: this.props.theme,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    /**
     * 渲染默认的cell
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param hightlightRow
     * @returns {XML}
     * @private
     */
    _renderDefaultRow(rowData, sectionID, rowID, hightlightRow) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this.props.onPressCell('我是来自子组件的数据');
                }}>
                <View style={styles.defaultRow}>
                    <Text>我是CELL</Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * 刷新重新渲染第一页数据
     * @private
     */
    _onRefresh() {
        this.page = 1;
        this._data = [];
        // 开启加载动画
        this.setState({
            isLoading: true
        });
        let url = this.props.url;
        let params = this.props.params;
        params.page = this.page;
        this.dataRepository.fetchNetRepository('POST', url, params).then(result => {
            if (result.success === true) {
                // 如果第一页没有数据，显示没有数据提示页面
                if (!result.data || result.data.length === 0) {
                    // alert(page);
                    this.setState({
                        isLoading: false,
                        noNetWord: false,
                        noData: true
                    })
                } else {
                    // 将请求数据保存到内存
                    this._data = this._data.concat(result.data);
                    this.setState({
                        result: result,
                        dataSource: this.state.dataSource.cloneWithRows(this._data),
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
     * 上拉加载更多
     * @private
     */
    _onLoadMore() {
        this.page++;
        let url = this.props.url;
        let params = this.props.params;
        params.page = this.page;
        this.dataRepository.fetchNetRepository('POST', url, params).then(result => {
            if (result.success === true) {
                // mock数据
                // result.data = this._data;
                // 如果第一页没有数据，显示没有数据提示页面
                if ((this.page > 1 && (!result.data || result.data.length === 0))) {
                    this.refs.toast.show(this.props.alertText);
                } else {
                    // 将请求数据保存到内存
                    this._data = this._data.concat(result.data);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this._data),
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

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            NetInfoUtils.checkNetworkState((isConnectedNet) => {
                if (isConnectedNet) {
                    this._onRefresh();
                } else {
                    this.setState({
                        noNetWork: true
                    });
                }
            });
        });

    }

    render() {
        let content =
            this.state.noNetWork ? <NoContentPage type='noNetWork'/>
                : this.state.noData ? <NoContentPage type='noData'/> : <ListView
                    dataSource={this.state.dataSource}
                    renderHeader={
                        this.props.renderHeader ? this.props.renderHeader : null
                    }
                    renderRow={
                        this.props.renderRow ? this.props.renderRow
                            : this._renderDefaultRow.bind(this)
                    }
                    onEndReachedThreshold={100}
                    onEndReached={() => {
                        this._onLoadMore();
                    }}
                    refreshControl={
                        <RefreshControl
                            title='加载中...'
                            titleColor={this.state.theme.themeColor}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            refreshing={this.state.isLoading}
                            onRefresh={() => {
                                // 刷新的时候从第一页重新获取数据
                                this._onRefresh();
                            }}/>
                    }/>;
        return (
            <View style={styles.container}>
                {content}
                <Toast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,0.3)'}}
                    position='bottom'
                    positionValue={300}
                    fadeInDuration={500}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#000000'}}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    defaultRow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        marginTop: 2,
        borderWidth: 2,
        borderColor: 'black',
    },
});
