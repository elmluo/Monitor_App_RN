import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {
    SwRefreshScrollView,
    SwRefreshListView,
    RefreshStatus,  // 刷新状态，用于自定义
    LoadMoreStatus  // 上拉加载状态，用于自定义
} from 'react-native-swRefresh'
import DataRepository from '../../expand/dao/Data'
import NetInfoUtils from '../../util/NetInfoUtils'
import Storage from '../../common/StorageClass'
import NoContentPage from '../../common/NoContentPage'

let storage = new Storage();
let dataRepository = new DataRepository();

export default class RefreshLoadMoreListView extends React.Component {
    _page = 1;
    _dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowLoadMore: true,
            dataSource: this._dataSource.cloneWithRows([{"siteId":"59955e134817ea150ede9e85","name":"测试站点ctg","tier":"浙江省-杭州市-江干区","longitude":null,"latitude":null,"fsuOnline":false,"operationState":"工程态","deviceCount":4}])  // 更新dataSource
        };
    }

    render() {
        return this._renderListView()
    }


    _renderListView() {
        return (
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                isShowLoadMore={this.state.isShowLoadMore}
                renderRow={this.props.renderRow.bind(this)}
                onRefresh={this._onListRefersh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
            />)
    }

    /**
     * 模拟刷新
     * @param end
     * @private
     */
    _onListRefersh(end) {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            this._page = 1;

            // 模拟数据
            let data = [];
            for (let i = 0; i < 10; i++) {
                data.push(i)
            }
            this.setState({
                dataSource: this._dataSource.cloneWithRows(data)
            });

            // 获取真实数据
            let url = this.props.url;
            let params = this.props.params;
            params.page = this._page;
            dataRepository.fetchNetRepository('POST', url, params).then(result => {
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
                            dataSource: this._dataSource.cloneWithRows(result.data),
                            isLoading: false,
                            noData: false,
                        });
                        console.log(1234567);
                        let timer = setTimeout(()=> {
                            clearTimeout(timer);
                            this.refs.listView.resetStatus();  //重置上拉加载的状态
                            end() // 调用即可停止刷新。
                        }, 500)
                    }
                } else {
                    console.log('连接服务失败')
                }
            }).catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                });
            });
        }, 2000)
    }

    /**
     * 模拟加载更多
     * @param end
     * @private
     */
    _onLoadMore(end) {
        // console.log(123456)
         let timer = setTimeout(() => {
            clearTimeout(timer);
            this._page++;
            let data = [];
            for (let i = 0; i < (this._page + 1) * 10; i++) {
                data.push(i)
            }


            let url = this.props.url;
            let params = this.props.params;
            params.page = this._page;

            dataRepository.fetchNetRepository('POST', url, params).then(result => {
                if (result.success === true) {
                    if (!result.data || result.data.length === 0) {
                        this.setState({
                            isLoading: false,
                            noNetWord: false,
                            noData: true
                        });
                        end(result.data);
                    } else {
                        console.log(JSON.stringify(result));
                        this.setState({
                            result: JSON.stringify(result),
                            dataSource: this._dataSource.cloneWithRows(result.data),
                            isLoading: false,
                            noData: false,
                        });
                        console.log(1234567);
                        this.refs.listView.resetStatus();  //重置上拉加载的状态
                        end(result.data.length < 20) // 返回的长度小于20调用即可停止刷新。
                    }
                } else {
                    console.log('连接服务失败')
                }
            }).catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                });
            })

            // this.setState({
            //     dataSource: this._dataSource.cloneWithRows(data)
            // })


            // 满足某个条件，停止刷新。
            // end(this._page > 5)

        }, 2000)
    }

    componentDidMount() {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法
    }

    /*--tip--:如果刷新和加载在同一个方法里，对于传递的参数end()函数无需区分。
    onRefresh中的end()函数 中接受参数没有任何关系 只要调用end()函数就会结束刷新或加载*/
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});