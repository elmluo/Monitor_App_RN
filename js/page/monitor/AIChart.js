import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
} from 'react-native'

let {width, height} = Dimensions.get('window');
import Echarts from '../../common/Echarts'
import Utils from '../../util/Utils.js'

export default class HomeStatisticChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.refs.echarts);
        // if (!nextProps.chartData.data) {
        //     this.props.chartData = {data:[]};
        // }
        //     this.refs.echarts.refs.chart.reload();
        // }
        if (nextProps.isReload) {
            this.refs.echarts.refs.chart.reload();
        }
    }

    render() {
        let yAxisArr = this.props.chartData.data.reverse().map(function (v) {
            return v.value;
        });
        // 获取数组内最小值。
        let minData = yAxisArr[0];
        for (let i = 0, len = yAxisArr.length; i < len; i++) {
            if (yAxisArr[i] < minData) {
                minData = yAxisArr[i];
            }
        }
        // console.log(minData);


        // alert(JSON.stringify(this.props.chartData));
        // console.log(this.props.chartData);
        let option = {
            backgroundColor: {
                type: 'linear',
                // x: 0,
                // y: 0,
                // x2: 0,
                // y2: 1,
                // colorStops: [{
                //     offset: 0, color: '#3B4BC2' // 0% 处的颜色
                // }, {
                //     offset: 0.4, color: '#46A4EC' // 100% 处的颜色
                // }]
            },
            tooltip: {
                axisPointer: {
                    type: 'line',
                    animation: true,
                },
                trigger: 'axis',
                formatter: function (v, p, f) {
                    return (v[0].data).toFixed(1) + '';
                },
                position: function (point, params, dom, rect, size) {
                    // 三角形
                    var triAng = document.createElement('div');
                    triAng.style.position = 'absolute';
                    triAng.style.border = '5px solid transparent';
                    triAng.style.borderTopColor = '#3AB0FF';
                    triAng.style.left = (size.contentSize[0] / 2 - 5) + 'px';
                    dom.appendChild(triAng);

                    // 时间
                    var time = document.createElement('div');
                    time.innerText = params[0].axisValue;
                    time.style.position = 'absolute';
                    time.style.borderTopColor = '#3AB0FF';
                    time.style.width = '100px';
                    time.style.textAlign = 'center';
                    time.style.fontSize = '0.8rem';
                    time.style.left = -(100 - size.contentSize[0]) / 2 + 'px';
                    time.style.top = size.contentSize[1] + 12 + 'px';

                    // dom.appendChild(time);

                    return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 10];
                },
                extraCssText: `background-color: ${this.props.theme.themeColor}; padding:0 5px;`
            },
            grid: {
                left: '9%',
                right: '7%',
                backgroundColor: "transparent",
                // containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    // boundaryGap : false,
                    data: this.props.chartData.data.reverse().map(function (v) {
                        return Utils.FormatTime(new Date(v.time), 'MM-dd hh:mm')
                    }),
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#EBEBEB'
                        }
                    },
                    axisLabel: {    // 坐标标签刻度值设置
                        interval: 3,
                        color: '#7E7E7E'
                    },
                    splitLine: {
                        interval: 3,
                        show: true,
                        lineStyle: {
                            color: "#EBEBEB"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    interval: 5, // 数据最大值的80%
                    show: true,
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: "rgba(255,255,255,0.1)"
                        }
                    },
                    min: minData - 2,
                    // axisTick: {
                    //     show: true
                    // },
                    axisLine: {
                        show: false,    // 隐藏yAxis
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#7E7E7E'
                    }
                },
            ],
            //     dataZoom: [{
            //     type: 'inside',
            //     start: 0,
            //     end:50
            // }],
            series: [
                {
                    name: 'seriesName',
                    type: 'line',
                    smooth: false,  // 是否平滑显示曲线
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(6,228,255,0)' // 0% 处的颜色
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
                                colorStops: [
                                    {
                                        offset: 0, color: '#8967FC' // 0% 处的颜色
                                    },
                                    {
                                        offset: 0.5, color: '#83E6CC' // 100% 处的颜色
                                    },
                                    {
                                        offset: 1, color: '#79CFF5' // 100% 处的颜色
                                    }
                                ]
                            }
                        }
                    },

                    data: this.props.chartData.data.reverse().map(function (v) {
                        return v.value;
                    }),
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
        return (
            <Echarts ref='echarts' option={option} height={this.props.height}/>
        )
    }
}