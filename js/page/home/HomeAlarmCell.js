
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native'

export default class HomeAlarmCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <View style={styles.cell}>
                <View style={styles.cellLeft}>
                    <Image
                        source={require('../../../res/Image/BaseIcon/ic_oneAlarm_nor.png')}/>
                    <View style={styles.cellLeftText}>
                        <Text style={styles.cellLeftAlarmCount}>{this.props.count}</Text>
                        <Text style={styles.cellLeftAlarmName}>{this.props.alarmName}</Text>
                    </View>
                </View>

                <View style={styles.cellRight}>
                    <Text>圆饼图</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    cell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 12,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 10,
        paddingBottom: 6,
        marginBottom: 6,
        backgroundColor: '#FFFFFF',

        borderRadius: 2,
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellLeftText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16
    },
    cellLeftAlarmCount: {
        fontSize: 22,
        color: "red",
    },
    cellLeftAlarmName: {
        marginTop: 2,
        fontSize: 12,
        color: '#6B6B6B'
    }
});
