/**
 *------------------- 自定义请求没有获取数据的时候，显示图片：-------------------------
 * 传入属性(this.props.)
 *      url   [string]    获取数据地址uri
 *      type  [string]    请求没有获得数据的时候，或者获取数据为空，需要实现的提示图片的
 *      onClick           添加点击图片执行方法。
 *----------------------------------------------------------
 */


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
                <View>
                    <TouchableOpacity
                        style={styles.content}
                        activeOpacity={1}
                        onPress={()=> {
                            this.props.onClick();
                        }}>
                        <Image source={require('../../res/Image/Anomaly/ic_noData.png')}/>
                        <Text style={styles.text}> 还没有数据哦</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (type === 'noNetWork') {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.content}
                        activeOpacity={1}
                        onPress={()=> {
                            this.props.onClick();
                        }}>
                        <Image source={require('../../res/Image/Anomaly/ic_noNetwork.png')}/>
                        <Text style={styles.text}> 请检查网络是否正常！</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (type === 'netWorkError') {
            return (
                <View>
                    <TouchableOpacity
                        style={styles.content}
                        activeOpacity={1}
                        onPress={()=> {
                            this.props.onClick();
                        }}>
                        <Image source={require('../../res/Image/Anomaly/ic_noNetworkError.png')}/>
                        <Text style={styles.text}> 网络连接错误！</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (type === 'noAlarm') {
            return (
                <View >
                    <TouchableOpacity
                        style={styles.content}
                        activeOpacity={1}
                        onPress={()=> {
                            this.props.onClick();
                        }}>
                        <Image source={require('../../res/Image/Anomaly/ic_noAlarm.png')}/>
                        <Text style={styles.text}> 还没有数据哦！</Text>
                    </TouchableOpacity>
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