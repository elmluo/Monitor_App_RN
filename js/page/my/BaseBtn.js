import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native'

let {width,height} = Dimensions.get('window')
export default class BaseBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
    }
    render() {

        return (

            <View style={styles.btnStyle}>
                <Text style={styles.btnTextStyle}>{this.props.text}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    btnStyle:{
        flexDirection:'row',
        alignItems: 'center',
        marginLeft:30,
        height:44,
        width:width - 60,
        borderRadius: 22,
        backgroundColor:'rgba(60,127,252,1)',
        justifyContent: 'space-around',

    },
    btnTextStyle:{
        fontSize:17,
        color:'#FFF',
        textAlign:'right'
    }

});
