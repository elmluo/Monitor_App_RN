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
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.refs.echarts);
        if (nextProps.isReload) {
            this.refs.echarts.refs.chart.reload();
        }
    }

    render() {

        let onlineRate = new Array(28).join('.').split('.').map(function (v) {
            return;
        });

        let scope = this;

        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        var hour = 1000 * 60 * 60;

        let monday3 = new Date(today.getTime() - hour * 24 * (new Date().getDay() - 2) - 21 * hour).getTime();
        this.props.chartData.forEach(function (v) {
            var id = (v.recordTime - monday3) / (6 * hour);
            id = Math.round(id);
            onlineRate[id] = v;
        });

        let lastValid = this.props.chartData[0];
        let lastValidIndex = onlineRate.indexOf(lastValid);
        let nextValid = this.props.chartData[1];
        let nextValidIndex = onlineRate.indexOf(nextValid);

        for (let itr = 0; itr < onlineRate.length; itr++) {
            if (!onlineRate[itr]) {
                onlineRate[itr] = {};
                onlineRate[itr].name = monday3 + itr * 6 * hour;
                if (itr === 0) {
                    onlineRate[itr].data = lastValid.onlineCount / (lastValid.onlineCount + lastValid.offlineCount);
                    lastValidIndex = 0;
                } else if (itr < nextValidIndex) {
                    let d0 = lastValid.onlineCount / (lastValid.onlineCount + lastValid.offlineCount);
                    let d1 = nextValid.onlineCount / (nextValid.onlineCount + nextValid.offlineCount);
                    onlineRate[itr].data = (d1 - d0) / (nextValidIndex - lastValidIndex) * (itr - lastValidIndex) + d0;
                    // console.log(d0, d1, lastValidIndex, nextValidIndex);
                } else {
                    onlineRate[itr].data = null;
                }
            } else {
                let temp = onlineRate[itr];
                onlineRate[itr] = {};
                onlineRate[itr].name = temp.recordTime;
                onlineRate[itr].data = temp.onlineCount / (temp.onlineCount + temp.offlineCount);
                onlineRate[itr].origin = true;

                lastValid = temp;
                lastValidIndex = itr;
                nextValid = this.props.chartData[this.props.chartData.indexOf(lastValid) + 1];
                if (nextValid) {
                    nextValidIndex = onlineRate.indexOf(nextValid);
                }
                // console.log(nextValidIndex, nextValid);

            }
        }

        let minData = onlineRate.reduce(function (v,o) {
            return (v.data < o.data || !o.data) ? v : o;
        }).data * 0.95;


        // 获取获取7天时间数组
        //[10-1,10-2,10-3.....]
        let xAxisData = this.props.chartData.map((item) => {
            let d = new Date(item.recordTime);
            d.setTime(item.recordTime);
            // return d.getMonth() + 1 + ' -' + d.getDate()

            return d;
        });

        // console.log(this.props.chartData);
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
                top: '55%',
                left: '2%',
                right: '2%'
                // backgroundColor: "transparent"
                // containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    // boundaryGap : false,
                    data: onlineRate.map(function (v) {
                        return '            ' + Utils.FormatTime(new Date(v.name), 'MM-dd');
                    }),
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
                        interval:3,

                    },
                    splitLine: {
                        interval:3,
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
                    min: minData,
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

                    data: onlineRate.map(function (v) {
                        return v.data;
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