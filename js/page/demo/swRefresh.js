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

export default class RefreshLoadMoreListView extends React.Component {
    _page = 0;
    _dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});


    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: this._dataSource.cloneWithRows([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
        };
    }

    render() {
        return this._renderListView()
    }

    _renderRow(rowData) {
        // alert(JSON.stringify(rowData));
        return (
            <View style={{height: 100}}>
                <View>
                    <Text>123</Text>
                </View>

            </View>
        )
    }

    _renderListView() {
        return (
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                renderRow={this._renderRow.bind(this)}

                // 设置下拉刷新的方法 传递参数end函数 当刷新操作结束时
                onRefresh={this._onListRefersh.bind(this)}

                /**
                * 处于pushing（加载更多时）状态时执行的方法
                * 参数：end，最后执行完操作后应该调用end(isNoMoreData)。
                * isNoMoreData 表示当前是否已经加载完所有数据 已无更多数据
                */
                onLoadMore={this._onLoadMore.bind(this)}

                //
                //
                /**
                * 可以通过state控制是否显示上拉加载组件，
                * 可用于数据不足一屏,或者要求数据全部加载完毕时不显示上拉加载控件
                */
                // isShowLoadMore={true}
                //
                // // 自定义下拉刷新视图参数，refresStatus是上面引入的RefreshStatus类型， 对应刷新状态各个状态。
                // // offsetY对应下拉的偏移量,可用于定制动画。
                // // 自定义视图必须通过customRefreshViewHeight指定高度
                // customRefreshView={(refresStatus, offsetY) => {
                //     return (<Text>{'状态:' + refresStatus + ',' + offsetY}</Text>)
                // }}
                //
                // // 自定义刷新视图时必须指定高度
                // customRefreshViewHeight={100}

            />)
    }

    /**
     * 模拟刷新
     * @param end
     * @private
     */
    _onListRefersh(end) {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this._page = 0
            let data = []
            for (let i = 0; i < 10; i++) {
                data.push(i)
            }
            this.setState({
                dataSource: this._dataSource.cloneWithRows(data)
            })
            this.refs.listView.resetStatus() //重置上拉加载的状态

            // 调用即可停止刷新。
            end()
            // this.refs.listView.endRefresh() //新增方法 结束刷新 建议使用end() 。当然这个可以在任何地方使用
        }, 1500)
    }

    /**
     * 模拟加载更多
     * @param end
     * @private
     */
    _onLoadMore(end) {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this._page++
            let data = []
            for (let i = 0; i < (this._page + 1) * 10; i++) {
                data.push(i)
            }
            this.setState({
                dataSource: this._dataSource.cloneWithRows(data)
            })


            // 满足某个条件，停止刷新。
            end(this._page > 5)

        }, 2000)
    }

    componentDidMount() {
        let timer = setTimeout(() => {
            clearTimeout(timer)
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