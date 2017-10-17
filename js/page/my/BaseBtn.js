import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native'

export default class BaseBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
    }
    render() {

        return (
            <View style={styles.cell}>

            </View>
        )
    }
}


const styles = StyleSheet.create({


});
