import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    ListView,
    Alert,
    TouchableOpacity,
    NetInfo
} from 'react-native';

let {width, height} = Dimensions.get('window');

export default class ComponentName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _renderContent(type) {
        if (type === 'noData') {
            return (
                <View style={styles.content}>
                    <Image source={require('../../res/Image/Anomaly/ic_noData.png')}/>
                    <Text style={styles.text}> 还没有数据哦</Text>
                </View>
            )
        } else if (type === 'noNetWork') {
            return (
                <View style={styles.content}>
                    <Image source={require('../../res/Image/Anomaly/ic_noNetwork.png')}/>
                    <Text style={styles.text}> 请检查网络是否正常！</Text>
                </View>
            )
        } else if (type === 'netWorkError') {
            return (
                <View style={styles.content}>
                    <Image source={require('../../res/Image/Anomaly/ic_noNetworkError.png')}/>
                    <Text style={styles.text}> 网络连接错误！</Text>
                </View>
            )
        } else if (type === 'noAlarm') {
            return (
                <View style={styles.content}>
                    <Image source={require('../../res/Image/Anomaly/ic_noAlarm.png')}/>
                    <Text style={styles.text}> 还没有告警哦！</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderContent(this.props.type)}
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        marginTop: height * 0.2,
        alignItems: 'center'
    },
    text: {
        marginTop: 20,
    }
});