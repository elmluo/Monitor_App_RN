import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import Storage from '../common/StorageClass'
import CustomListView from '../common/CustomListView'
import NavigationBar from '../common/NavigationBar'
import BackPressComponent from '../common/BackPressComponent'

let storage = new Storage();

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
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
                            source={require('../../res/Image/Nav/ic_backItem.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let url = this.props.url;

        // 注意如果是从父组件传递过来的对象，同一个引用，最好是重新赋值一个对象。
        let params = {
            stamp: storage.getLoginInfo().stamp,
            page: 1,
            size: 20,
        };
        params.keyword= this.props.searchText;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'搜索结果'}
                    statusBar={statusBar}
                    leftButton={this._renderLeftButton()}
                    style={this.state.theme.styles.navBar}/>

                <CustomListView
                    {...this.props}
                    url={url}
                    params={params}
                    // bind(this)机制需要熟悉
                    renderRow={this.props.renderRow.bind(this)}     // 直接使用从爷组件中传入renderRow方法
                    // renderHeader={this._renderHeader.bind(this)}
                    alertText={'没有更多数据了~'}/>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red'
    },
});