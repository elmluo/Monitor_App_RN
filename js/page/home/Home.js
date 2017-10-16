/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Platform,
    Dimensions,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinList from './BulletinList'
import MyPage from '../my/MyPage'
import MyInfoPage from '../my/MyInfoPage'
import HomeAlarmCell from './HomeAlarmCell'
import HomeStatisticChart from './HomeStatisticChart'
import Echarts from 'native-echarts'
let {width, height} = Dimensions.get('window');

export default class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            isLoading: false,
            cellData: {
                count: 123,
                color: '#ff0000',
                name: '一级告警'
            }
        }
    }

    /**
     * 渲染navigationBar右侧按钮
     * @returns {XML}
     * @private
     */
    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: BulletinList,
                            params: {...this.props}
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_notice_nor.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 渲染navigationBar右侧按钮
     * @returns {XML}
     * @private
     */
    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.push({
                            component: MyInfoPage,
                            params: {...this.props}
                        })
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                        style={{width:24,height:24}}
                        source={require('../../../res/Image/Nav/ic_myItem.png')}
                        />
                        {/*<Text>个人</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let option = {
            backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#3B4BC2' // 0% 处的颜色
                }, {
                    offset: 0.4, color: '#46A4EC' // 100% 处的颜色
                }]
            },
            tooltip : {
                axisPointer: {
                    type: 'none',
                    animation: true,
                },
                trigger: 'axis',
                formatter (v, p, f) {
                    return v[0].data;
                },
                // ptosition (point, params, dom, rect, size) {
                //     var triAng = document.createElement('div');
                //     triAng.style.position = 'absolute';
                //     triAng.style.border = '5px solid transparent';
                //     triAng.style.borderTopColor = '#3AB0FF';
                //     triAng.style.left = (size.contentSize[0] / 2 - 5) + 'px';
                //     dom.appendChild(triAng);
                //
                //     var time = document.createElement('div');
                //     time.innerText = params[0].axisValue;
                //     time.style.position = 'absolute';
                //     time.style.borderTopColor = '#3AB0FF';
                //     time.style.width = '100px';
                //     time.style.textAlign = 'center';
                //     time.style.fontSize = '0.8rem';
                //     time.style.left = - (100 - size.contentSize[0]) / 2 + 'px';
                //     time.style.top = size.contentSize[1] + 12 + 'px';
                //
                //     dom.appendChild(time);
                //
                //     // 固定在顶部
                //     return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 10];
                // },
                exraCssText: 'background-color:#3AB0FF; padding:0 5px;'
            },
            grid: {
                left: '2%',
                right: '2%'
                // backgroundColor: "transparent"
                // containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    // boundaryGap : false,
                    data : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  //list.map(v=>new Date(v.time).Format('hh:mm:ss')),
                    boundaryGap: false,
                    axisTick: {
                        show:false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        interval: 3,
                    },
                    splitLine: {
                        show: true,
                        interval: 3,
                        lineStyle: {
                            color: "rgba(255,255,255,0.1)"
                        }
                    },
                }
            ],
            yAxis : [
                {
                    interval: 3, // 数据最大值的80%
                    show: true,
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.1)"
                        }
                    },

                    axisTick: {
                        show:false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
            ],
            //     dataZoom: [{
            //     type: 'inside',
            //     start: 0,
            //     end:50
            // }],
            series : [
                {
                    name:'seriesName',
                    type:'line',
                    smooth: true,
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(6,228,255,1)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(6,228,255,0)' // 100% 处的颜色
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 4,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: '#06E4FF' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#FFFFFF' // 100% 处的颜色
                                }]
                            }
                        }
                    },
                    data: [6,1,7,4,9,0,3,5,7,1,6,1,7,4,9,0,3,5,7,1,6,1,7,4,9,0,3,1],//list.map(v=>v.value),
                    markPoint: {
                        symbol: 'rect',
                        symbolSize: 100
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0
                        },
                        emphasis: {
                            opacity: 1,
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 10
                        }
                    }
                }
            ]
        };
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
            title={'主控页面'}
            statusBar={statusBar}
            style={this.state.theme.styles.navBar}
            rightButton={this._renderRightButton()}
            leftButton={this._renderLeftButton()}/>;
        let content =
            <ScrollView
                style={styles.scrollView}
                ref='scrollView'
                horizontal={false}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}  // 水平滚动条控制
                pagingEnabled={true}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor={this.props.theme.themeColor}
                        colors={[this.props.theme.themeColor]}
                        refreshing={this.state.isLoading}
                        onRefresh={() => alert('将重新加载数据')}
                        tintColor={this.props.theme.themeColor}
                    />
                }>
                <View style={{flex: 1}}>
                    <ImageBackground
                        style={styles.gb}
                        source={require('../../../res/Image/Login/ic_login_bg.png')}
                    >
                        <HomeStatisticChart width={width} height={height*0.4}/>
                        {/*<Echarts option={option} height={300} />*/}
                    </ImageBackground>
                    <View style={styles.alarm}>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                        <HomeAlarmCell count = {this.state.cellData.count} alarmName ={this.state.cellData.name} alarmColor={this.state.cellData.color}/>
                    </View>
                </View>
            </ScrollView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>

        )
    }

    componentDidMount() {

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollView: {
      backgroundColor: 'pink'
    },
    gb: {
        width: width,
        height: 0.4 * height,
    },
    overlay: {
        width: width,
        height: 0.1 * height,
        position: 'absolute',
        // bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // alignItems: 'center',
    },

    alarm: {
        position: 'relative',
        top: -height* 0.05,
        marginLeft: 16,
        marginRight: 16,
    },

});

