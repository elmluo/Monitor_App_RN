
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    ART,
} from 'react-native'

const {Surface, Group, Shape, Path} = ART;

import Wedge from '../../common/Wedge';

export default class HomeAlarmCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
    }
    render() {
        // 饼图背景圆路径
        const pathCircle = new Path()
            .moveTo(21,0)
            .arc(0,42,21)
            .arc(0,-42,21)
            .close();


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
                    {/*圆饼图*/}
                    <Surface width={42} height={42}>
                        <Group>
                            {/*底部圆*/}
                            <Shape d={pathCircle} fill='#F3F3F3'/>
                            <Wedge
                                outerRadius={21}
                                startAngle={0}
                                endAngle={100}
                                originX={50}
                                originY={50}
                                fill="red"/>
                        </Group>
                    </Surface>
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
        paddingTop: 9,
        paddingBottom: 9,
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
        marginTop: 6,
        fontSize: 12,
        color: '#6B6B6B'
    },
    cellRight: {
        width: 42,
        height: 42,
        borderRadius: 21,
    }
});
