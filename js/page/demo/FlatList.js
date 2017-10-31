import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Button,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const { height, width } = Dimensions.get('window');
var ITEM_HEIGHT = 100;


export default class FlatListExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        };
    }
    _renderItem = (item, index) => {
        let item1 = item;
        var txt = '第' + item1.index + '个' + ' title=' + item1.item.title;
        var bgColor = item1.index % 2 == 0 ? 'red' : 'blue';
        return (
            <TouchableOpacity onPress={() => {
                alert(txt);
            } }>
                <Text style={[{ flex: 1, height: ITEM_HEIGHT, backgroundColor: bgColor, width: width / 2 }, styles.txt]}>{txt}</Text>
            </TouchableOpacity>
        )
    }

    _header = () => {
        return <Text style={[styles.txt, { backgroundColor: 'black' }]}>这是头部</Text>;
    }

    _footer = () => {
        return <Text style={[styles.txt, { backgroundColor: 'black' }]}>这是尾部</Text>;
    }
    _separator = () => {
        return <View style={{ height: 2, backgroundColor: 'yellow' }}/>;
    }
    _onRefresh() {
        alert('正在刷新中.... ');
    }
    render() {
        var data = [];
        for (var i = 0; i < 31; i++) {
            data.push({ key: i, title: i + '' });
        }
        return (
            <View style={{ flex: 1 }}>
                <Button title='滚动到指定位置' onPress={() => {
                    //this._flatList.scrollToEnd();
                    //this._flatList.scrollToIndex({viewPosition:0,index:8});
                    this._flatList.scrollToOffset({ animated: true, offset: 2000 });
                } }/>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}   // FlatList名称
                        ListHeaderComponent={this._header}  // 头部组件
                        ListFooterComponent={this._footer}  // 尾部组件
                        ItemSeparatorComponent={this._separator}    // item分隔线
                        // initialNumToRender={4}  // 指定一开始渲染元素数量
                        renderItem={this._renderItem}   // 渲染的cell组件
                        numColumns ={2} //布局
                        columnWrapperStyle={{ borderWidth: 2, borderColor: 'black' }}   // 列容器样式
                        refreshing={this.state.refreshing}  // 是否显示加载动画
                        getItemLayout={(data, index) => (   //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度
                            { length: ITEM_HEIGHT, offset: (ITEM_HEIGHT + 2) * index, index }
                        ) }
                        onRefresh={this._onRefresh}  // 下拉刷新操作 自动添加RefreshControl组件
                        onEndReachedThreshold={0} //  距离列表底部多远
                        onEndReached={(info) => {   // 达到距离列表底部多远是触发。
                            alert("滑动到底部了");
                            for (var i = 0; i < 20; i++) {
                                data.push({ key: i, title: i + '' });
                            }
                        } }

                        onViewableItemsChanged={(info) => {     // 在可见元素变化时调用
                            //    alert("可见不可见触发");
                        } }
                        data={data} // 数据数组
                    >
                    </FlatList>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});


module.exports = FlatListExample;