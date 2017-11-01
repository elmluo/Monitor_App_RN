import React, { Component } from 'react';
import {
    Animated, Easing
} from 'react-native';

export default class FadeInView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _opacity: new Animated.Value(0),          // 透明度初始值设为0
            _left: new Animated.Value(0),                // 定位左边初始值为10
            _twirl: new Animated.Value(0)           // 旋转的初始值为0
        };
    }
    componentDidMount() {
        // Animated.timing(                            // 随时间变化而执行的动画类型
        //     this.state._opacity,                      // 动画中的变量值
        //     {
        //         toValue: 1,                             // 透明度最终 变为1，即完全不透明
        //         // easing: Easing.back,                     // 缓冲效果轨迹
        //         duration: 5000                          // 效果过度时间
        //     }
        // ).start();                                  // 开始执行动画

        // 组合动画
        Animated.parallel([             // parallel 同时执行， sequence：顺序执行
            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state._opacity,                      // 动画中的变量值
                {
                    toValue: 1,                             // 透明度最终 变为1，即完全不透明
                    // easing: Easing.back,                     // 缓冲效果轨迹
                    duration: 5000,                          // 效果过度时间
                }
            ),
            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state._left,                      // 动画中的变量值
                {
                    toValue: 100,                             // 透明度最终 变为1，即完全不透明
                    // easing: Easing.back,                     // 缓冲效果轨迹
                    duration: 5000,                          // 效果过度时间
                }
            )
        ]).start();
    }
    render() {
        return (
            <Animated.View                            // 可动画化的视图组件
                style={{
                    ...this.props.style,
                    opacity: this.state._opacity,          // 将透明度指定为动画变量值
                    position: 'absolute',
                    left: this.state._left,
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}