/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'

export default class BulletinDetail extends Component {
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

    render() {
        var statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        }
        let navigationBar =
            <NavigationBar
                title={'公告详情'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text>公告详情</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
