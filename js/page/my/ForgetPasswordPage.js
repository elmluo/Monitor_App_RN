import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Btn from '../my/BaseBtn'
import ResetPasswordPage from '../my/ResetPasswordPage'

let {width,height} = Dimensions.get('window')
export default class ForgetPasswordPage extends React.Component {
    constructor(props) {
        super(props);

        let timeLeft = this.props.timeLeft > 0 ? this.props.timeLeft : 60;
        let begin = 0;

        this.afterEnd = this.props.afterEnd || this._afterEnd;
        this.style = this.props.style;

        this.state = {
            theme: this.props.theme,
            btnText: '下一步',
            timeLeft: timeLeft,
            begin: begin,
            textColor: 'rgb(60,127,252)'
        };

    }

    /**
     * 倒计时逻辑计算
     * @param time     数值
     * @param callback 回调
     * @param begin    开始
     */
    countdownfn(time, callback, begin) {
        if (time > 0) {
            this.state.begin = 1;
            console.log("===lin===>");
            let that = this;
            let interval = setInterval(function () {
                if (that.state.timeLeft < 1) {
                    clearInterval(interval);
                    callback(that)
                } else {
                    let totalTime = that.state.timeLeft;
                    that.setState({
                        timeLeft: totalTime - 1,
                        textColor : 'gray'
                    })
                }
            }, 1000)
        }
    }

    /**
     * 获取验证码倒计时开始
     * @private
     */

    _beginCountDown() {
        if (this.state.begin === 1){
            return;
        }
        let time = this.state.timeLeft;
        console.log("===lin===> time " + time);
        let afterEnd = this.afterEnd;
        let begin = this.state.begin;
        console.log("===lin===> start " + begin);
        this.countdownfn(time, afterEnd, begin)
    }

    /**
     * 获取验证码倒计时结束重置属性
     * @param that 传入 this
     * @private
     */
    _afterEnd(that) {
        console.log('------------time over');
        that.setState({
            textColor : 'rgb(60,127,252)',
            begin : 0,
            timeLeft : 60,
        })
    }

    /**
     * 初始化左侧返回按钮
     * @returns {XML} 返回按钮
     * @private
     */
    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.pop();
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'手机验证'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
            />;
        return (
            //手机号码验证
            <View style={styles.container}>
                {navigationBar}
                <View>
                    <View style = {styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholderTextColor = '#7E7E7E'
                            placeholder="请输入手机号"
                            clearTextOnFocus={true}
                            keyboardType = 'numeric'
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({username: input})}>
                        </TextInput>
                    </View>
                    <View style = {styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholderTextColor = '#7E7E7E'
                            placeholder="请输入验证码"
                            keyboardType = 'numeric'
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({username: input})}>
                        </TextInput>
                        <Text
                            onPress={() => {
                                this._beginCountDown();
                            }}
                            style={{color: this.state.textColor, fontSize: 12,height:30,textAlign:'center',top:20,left:-65,width:70}}>
                            { this.state.begin === 0 ? '获取验证码' : this.state.timeLeft}
                        </Text>
                    </View>
                </View>
                <View style = {{marginTop:60,width:200,height:50,backgroundColor:'#FFF'}}>

                    <TouchableOpacity onPress={() => {
                        this.props.navigator.push({
                            component: ResetPasswordPage,
                            params: {...this.props}
                        })
                    }}>
                        <Btn text = {this.state.btnText} />
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFF',

    },
    bgView:{
        backgroundColor: 'white',
        alignSelf:'center',
        marginTop:49,
    },
    textInputViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:30,
        marginRight:30,
        borderBottomWidth:1,
        borderBottomColor:'rgb(235,235,235)'

    },
    textInputSize:{
        marginTop:20,
        height:50,
        width:width-60,
        textAlign:'left'
    }
});