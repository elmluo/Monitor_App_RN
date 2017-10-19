import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';

export default class BulletinSlideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View>
                    <Text> </Text>
                </View>
                <TouchableOpacity
                    onPress={()=> {
                        this.props.onPressText();
                    }}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=> {
                        this.props.onPressClose()
                    }}>
                    <View style={styles.imgClose}>
                        <Image
                            source={require('../../../res/Image/BaseIcon/ic_close_transparent.png')}/>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.18)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16
    },
    text: {
        fontSize: 14,
        color: '#FFFFFF'
    },
    imgClose: {
        justifyContent: 'center',
        height: 30
    }

});