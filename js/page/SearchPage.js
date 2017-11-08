import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    Platform,
} from 'react-native';

import Storage from '../common/StorageClass'
import Searchbox from "../common/Searchbox";
import Toast from 'react-native-easy-toast';
import SearchResult from './SearchResultPage'
import BackPressComponent from '../common/BackPressComponent'

let storage = new Storage();

export default class ComponentName extends React.Component {

    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
            hisArr: storage.getAllSearchHistory(),
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

    _addSearchHistory(item) {
        // 保存到storage中
        storage.addSearchHistory(item);
        // 更新视图
        this.setState({
            hisArr: storage.getAllSearchHistory()
        })
    }

    _deleteHistoryButton(item) {
        // 删除storage中的对应项
        storage.deleteSearchHistory(item);
        // 更新视图
        this.setState({
            hisArr: storage.getAllSearchHistory()
        })
    }

    _deleteAllHistory() {
        // 删除storage中所有项
        storage.deleteAllSearchHistory();
        // 更新试图
        this.setState({
            hisArr: storage.getAllSearchHistory()
        })
    }

    _pushToSearchResult(searchText) {
        this.props.navigator.push({
            component: SearchResult,
            params: {
                searchText: searchText,
                ...this.props
            }
        })
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={[this.state.theme.styles.navBar, styles.header]}>
                    <Searchbox
                        {...this.props}
                        placeholder={this.props.title}
                        onSearch={(searchText) => {     // 会拿到子组件返回的数据
                            this._addSearchHistory(searchText);
                            // 跳转到搜索结果页面 传入搜索内容
                            this._pushToSearchResult(searchText);
                        }}/>

                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigator.pop();
                        }}>
                        <Text style={{color: '#FFFFFF', fontSize: 14}}>返回</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.searchHistory}>

                    <View style={styles.searchHistoryHead}>
                        <Text style={{fontSize: 12, color: '#444444'}}>搜索记录</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this._deleteAllHistory();
                            }}>
                            {/*<Image source={require('../../res/Image/')}/>*/}
                            <Text>删除</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <View style={styles.searchHistoryContent}>
                            {
                                this.state.hisArr.map((item) => {
                                    // return this._renderHistoryButton(item)
                                    return <View style={styles.historyButton}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // 点击记录按钮，搜索点击内容
                                                this._pushToSearchResult(item);
                                            }}
                                            style={styles.historyButtonText}>
                                            <Text>{item}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.historyButtonClose}
                                            onPress={() => {
                                                this._deleteHistoryButton(item)
                                            }}>
                                            <Image style={{width: 8, height: 8}}
                                                   source={require('../../res/Image/BaseIcon/ic_close_transparent.png')}/>
                                        </TouchableOpacity>
                                    </View>
                                })
                            }
                        </View>
                    </ScrollView>

                </View>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: Platform.OS === 'ios' ? 28 : 8,
        paddingBottom: 8,
    },
    searchHistory: {},
    searchHistoryHead: {
        padding: 16,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchHistoryContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 16,
        paddingBottom: 100,
        backgroundColor: '#FFFFFF',
    },
    historyButton: {
        backgroundColor: 'transparent',
        height: 48,
        padding: 8,
        paddingLeft: 0,
        marginRight: 10
    },
    historyButtonText: {
        backgroundColor: '#F3F3F3',
        height: 28,
        paddingTop: 3,
        paddingRight: 6,
        paddingLeft: 8,
        borderRadius: 14,
    },
    historyButtonClose: {
        backgroundColor: '#6D6D6D',
        position: 'absolute',
        right: 0,
        top: 2,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7.5,
    }
});
