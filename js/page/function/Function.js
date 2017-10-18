/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
export default class Function extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }
    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'服务页'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>;
        return(
            <View style={styles.container}>
                {navigationBar}
                <Text>functionPage</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
