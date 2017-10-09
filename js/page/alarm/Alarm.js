/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native'
export default class Alarm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <View style={styles.container}>
                <Text>AlarmPage</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
});
