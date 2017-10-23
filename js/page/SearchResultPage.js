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

let storage = new Storage();

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        };
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
        let params = this.props.params;
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