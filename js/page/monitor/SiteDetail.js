/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import CustomListView from '../../common/CustomListView'
import Storage from '../../common/StorageClass'

let storage = new Storage();

export default class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
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
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        alert('还不能打开地图功能')
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_map_nor.png')}/>
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
        let navigationBar =
            <NavigationBar
                title={this.props.item.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
                rightButton={this._renderRightButton()}/>;

        let url = '/app/v2/site/model/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            page: 1,
            size: 20,
        };
        let content =
            <CustomListView
                {...this.props}
                url={url}
                params={params}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}
                onPressCell={(data) => {
                    alert(data)
                }}
            />;

        return (
            <View style={styles.container}>
                {navigationBar}

                {/*<RefreshLoadMoreListView />*/}
                {content}
            </View>
        )
    }

    _renderRow(rowRow) {
        return (
            <View style={{height: 10}}>
                <Text>{rowRow.name}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
