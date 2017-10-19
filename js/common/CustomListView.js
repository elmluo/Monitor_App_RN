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

    /***
     * 获取站点列表
     * @private
     */
    _getList() {
        // 开启加载动画
        this.setState({
            isLoading: true
        });
        let url = this.props.url;
        let params = this.props.params;
        params.page = 1;
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

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            NetInfoUtils.checkNetworkState((isConnectedNet) => {
                if (isConnectedNet) {
                    this._getList();
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
                    renderRow={
                        this.props.renderRow ? this.props.renderRow.bind(this)
                            : this._renderDefaultRow.bind(this)
                    }
                    onEndReachedThreshold={50}
                    onEndReached={() => {
                        alert('到底了');
                        this._getList()
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
                                this._getList();
                            }}/>
                    }/>;


        return (
            <View style={styles.container}>
                {content}
                {/*<Text>{this.state.result}</Text>*/}
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
