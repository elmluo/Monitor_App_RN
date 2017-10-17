import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
} from 'react-native'

let {width, height} = Dimensions.get('window');
import Echarts from '../../common/Echarts'

export default class HomeStatisticChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.refs.echarts);
        if (nextProps.isReload) {
            this.refs.echarts.refs.chart.reload();
        }
    }

    render() {

        // 获取获取7天时间数组
        //[10-1,10-2,10-3.....]
        let xAxisData = this.props.chartData.map((item) => {
            let d = new Date();
            d.setTime(item.recordTime);
            // console.log(d);
            // return d.getMonth() + 1 + ' -' + d.getDate()

            return d;
        });

        console.log(this.props.chartData);
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
            tooltip: {
                axisPointer: {
                    type: 'none',
                    animation: true,
                },
                trigger: 'axis',
                formatter: function (v, p, f) {
                    return (v[0].data * 100).toFixed(1) + '%';
                },
                position: function (point, params, dom, rect, size) {
                    var triAng = document.createElement('div');
                    triAng.style.position = 'absolute';
                    triAng.style.border = '5px solid transparent';
                    triAng.style.borderTopColor = '#3AB0FF';
                    triAng.style.left = (size.contentSize[0] / 2 - 5) + 'px';
                    dom.appendChild(triAng);

                    var time = document.createElement('div');
                    time.innerText = params[0].axisValue;
                    time.style.position = 'absolute';
                    time.style.borderTopColor = '#3AB0FF';
                    time.style.width = '100px';
                    time.style.textAlign = 'center';
                    time.style.fontSize = '0.8rem';
                    time.style.left = -(100 - size.contentSize[0]) / 2 + 'px';
                    time.style.top = size.contentSize[1] + 12 + 'px';

                    dom.appendChild(time);

                    return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 10];
                },
                extraCssText: 'background-color:#3AB0FF; padding:0 5px;'
            },
            grid: {
                left: '2%',
                right: '2%'
                // backgroundColor: "transparent"
                // containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    // boundaryGap : false,
                    data: xAxisData,  //list.map(v=>new Date(v.time).Format('hh:mm:ss')),
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,0.1)"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    interval: 3, // 数据最大值的80%
                    show: true,
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.1)"
                        }
                    },

                    axisTick: {
                        show: false
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
            series: [
                {
                    name: 'seriesName',
                    type: 'line',
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

                    data: this.props.chartData.map(v => (v.onlineCount / (v.onlineCount + v.offlineCount))),//list.map(v=>v.value),
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