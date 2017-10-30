/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ART,
    Text,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import Wedge from './Wedge'
import FadeInView from './FadeInView'
import ArtDemo from './animated_heart'

import Echarts from 'native-echarts'

// 进入ART组件
const {Surface, Group, Shape, Path} = ART;

let AnimatedWedge = Animated.createAnimatedComponent(Wedge);


export default class ARTDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            startAngle: new Animated.Value(0),
            endAngle: new Animated.Value(90),
            legendMail: {
                name: '邮件营销',
                icon: 'circle',
                textStyle: {
                    color: 'red'
                }
            }

        }
    }
    componentDidMount() {
        Animated.parallel([
            Animated.timing(
                this.state.endAngle,
                {
                    toValue: 405,
                    duration: 700,
                    easing: Easing.linear,
                }
            ),
            Animated.timing(
                this.state.startAngle,
                {
                    toValue: 135,
                    duration: 700,
                    easing: Easing.linear,
                })
        ]).start();
    }
    render() {
        // // [10,5] : 表示绘10像素实线在绘5像素空白，如此循环
        // // [10,5,20,5] : 表示绘10像素实线在绘制5像素空白在绘20像素实线及5像素空白
        // const linePath = new Path()
        //     .moveTo(1,1)
        //     .lineTo(300, 1);
        //
        // // 通过lineTo绘制三条边，在使用close链接第四条边。fill做颜色填充
        // const rectanglePath = new Path()
        //     .moveTo(1,1)
        //     .lineTo(1,99)
        //     .lineTo(99,99)
        //     .lineTo(99,1)
        //     .close();
        //
        // // arc(x,y,radius)的使用, 终点坐标距离起点坐标的相对距离
        // const circlePath = new Path()
        //     .moveTo(50,1)
        //     .arc(0, 99, 25)
        //     .arc(0,-99, 25)
        //     .close();

        const option = {
            //title 组件样式配置
            title: {
                show: true,
                text: '堆叠\n区域图',
                // 文字样式
                textStyle: {
                    color: '#DDDDDD',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                    fontSize: 48,
                    align: 'right',
                    verticalAlign: 'bottom',
                    // lineHeight: '56',
                    // textBorderColor: '#FF0000',
                    // textBorderWidth: 2,
                    // textShadowColor: 'yellow',
                    // textShadowBlur: '3',
                    // textShadowOffsetX: 10,
                    // textShadowOffsetY: 10,
                }, // 部分暂不支持
                // subText: '副文本标题',
                // subTextStyle: {}  // rn暂不支持
                padding: 10,
                // zlevel: -1, //  canvas分层，回影响过多的性能消耗，
                z: -1,   // 优先级步zlevel低，但是不会创建canvas
                left: '20%',  // 组件相对于左侧的距离，
                top: '20%',
                // right: 'auto',
                // bottom: 'auto',
                backgroundColor: 'red',
                borderColor: '#000000',
                borderWidth: 3,
                // borderRadius: 10,  //rn 中展示无效
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
            },

            // 图例组件
            legend: {
                // shaw: false,
                // type: 'scroll',    // 图例类型
                // itemGap: 40,  // 图例
                // itemWidth: 100,
                // itemeight: 40, // 图例标记的长度
                // orient: 'vertical', //纵向布局
                // align: 'auto', // 图例文字和图标的对其方式，默认自动
                // padding: [5,5,5,5],
                selectedMode: 'single',  // 选择，默认multiple多选
                // tooltip: {
                //     show: true
                // },
                // inactiveColor: '#ccc', // 图例关闭时的颜色
                // selected: 'true',    // 图例选中状态表，rn 卡顿，消耗性能。
                // textStyle: {}  // 和一般组件的文字样式设置一样

                data:[
                    {
                        name: this.state.legendMail.name,
                        icon: this.state.legendMail.icon,
                        textStyle: this.state.legendMail.textStyle,
                    },
                    '联盟广告',
                    '\n','视频广告','直接访问','搜索引擎'
                ],
                backgroundColor: 'yellow',
                borderColor: 'black',
                borderWidth: 2,
                // borderRadius: [5,5,5,5],
                shadowBlur: 30,
                shadowColor: 'red',
                shadowOffsetX: '10',
                shadowOffsetY: '20',
                // animation: false, //是否显示图例翻页动画
                animationDurationUpdate: 800, // 图例翻页时的延时动画。


            },

            // 提示框组件配置
            tooltip : {
                trigger: 'axis',    // 提示框类型
                axisPointer: {      // 坐标指示器配置（适用于简单场景，其他场景在xAxis等，下面配置才更好，而且优先级高）
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },

            // 直角坐标系内绘图网格组件，一个grid 两个xAxis，两个yAxis。
            grid: {
                // show: true, 默认选项
                z: 3,
                top: 60, //到图标容器组件的距离
                left: 8,
                right: '8%',
                bottom: '3%',
                height: 'auto',
                containLabel: true, //是否包含坐标刻度标签，和xAxis，关联Axis，
                backgroundColor: 'transparent',
                borderColor: 'black',
                borderWidth: 2,
                shadowBlur: 1,
                shadowColor: 'blue',
                shadowOffsetX: 5,
                shadowOffsetY: 5,
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    smooth: true,
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {smooth: true,
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };


        return(
            <View style={styles.container}>

                {/*<Surface width={300} height={50}>*/}
                    {/*<Shape*/}
                        {/*d={linePath}*/}
                        {/*stroke="#000000"*/}
                        {/*strokeWidth={30}*/}
                        {/*strokeDash={[10,5]}/>*/}
                {/*</Surface>*/}

                {/*<Surface width={200} height={100} style={{margin: 16, backgroundColor: 'red'}}>*/}
                    {/*<Shape d={rectanglePath} stroke="#000000" fill="#892265" strokeWidth={1} />*/}
                {/*</Surface>*/}

                {/*<Surface width={300} height={100} style={{margin: 16, backgroundColor: 'red'}}>*/}
                    {/*<Shape*/}
                        {/*d={circlePath}*/}
                        {/*stroke='#00FF00'*/}
                        {/*fill='yellow'*/}
                        {/*strokeWidth={4}/>*/}
                {/*</Surface>*/}

                {/*<Surface width={220} height={200} style={{padding: 16, margin: 16, backgroundColor: 'blue'}}>*/}
                    {/*<Text*/}
                        {/*strokeWidth={3}*/}
                        {/*stroke="#000"*/}
                        {/*fill='yellow'*/}
                        {/*font="bold 35px Heiti SC">*/}
                        {/*TextContent*/}
                    {/*</Text>*/}
                {/*</Surface>*/}




                {/*<ArtDemo/>*/}
                <View style={{marginTop: 30}}>
                    <Echarts option={option} height={300} />
                </View>


                {/*<FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>*/}
                {/*</FadeInView>*/}

                {/*<Surface width={100} height={100} style={{backgroundColor: 'blue'}}>*/}
                    {/*<Group>*/}
                        {/*<Wedge*/}
                            {/*outerRadius={50}*/}
                            {/*startAngle={0}*/}
                            {/*endAngle={100}*/}
                            {/*originX={50}*/}
                            {/*originY={50}*/}
                            {/*fill="red"/>*/}
                    {/*</Group>*/}


                {/*</Surface>*/}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
