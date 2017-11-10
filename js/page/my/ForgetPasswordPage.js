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
import DataRepository from '../../expand/dao/Data'
import Toast, {DURATION} from 'react-native-easy-toast';

let {width,height} = Dimensions.get('window');
let dataRepository = new DataRepository();
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
            textColor: 'rgb(60,127,252)',
            phone:'',
            forget:'',
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
            // console.log("===lin===>");
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
        let url = '/app/v2/sms/verify';
        let params = {
            phone: this.state.phone,
        };
        if (this.state.phone.length ===1){
            this.refs.toast.show('*请输入手机号');
        }else {
            if(this.state.phone.length != 11 && !this._verificationOfMobilePhone(this.state.phone)){
                this.refs.toast.show('*请输入正确的手机号');

            } else {
                dataRepository.fetchNetRepository('POST', url, params)
                    .then((response) => {
                        if (response.success === true) {
                            this.refs.toast.show('*发送验证码成功');
                            if (this.state.begin === 1){
                                return;
                            }
                            let time = this.state.timeLeft;
                            // console.log("===lin===> time " + time);
                            let afterEnd = this.afterEnd;
                            let begin = this.state.begin;
                            // console.log("===lin===> start " + begin);
                            this.countdownfn(time, afterEnd, begin)
                        } else {
                            this.refs.toast.show('*获取验证码失败请重试');
                        }

                    });
            }
        }

    }

    /**
     * 获取验证码倒计时结束重置属性
     * @param that 传入 this
     * @private
     */
    _afterEnd(that) {
        // console.log('------------time over');
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

    _verificationOfMobilePhone(phone){
        let PATTERN_CHINAMOBILE = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\\d{8}$/;
        if (PATTERN_CHINAMOBILE.test(phone)) {
            return true;
        }else {
            return false;
        }
    }


    /**
     * 手机短信验证
     * @private
     */
    _shortMessageIdentification(){
        let url = '/app/v2/user/phone/verify';
        let params = {
            phone: this.state.phone,
            code:this.state.forget,
        };
        // alert(JSON.stringify(response.data));
        if (this.state.phone.length === 1) {
            this.refs.toast.show('*请输入手机号');
        } else {
            if (this.state.phone.length != 11 && !this._verificationOfMobilePhone(this.state.phone)) {
                this.refs.toast.show('*请输入有效的手机号');
            } else {


                dataRepository.fetchNetRepository('POST', url, params)
                    .then((response) => {
                    console.log(JSON.stringify(response));
                        if (response.success === true) {
                            this.props.navigator.push({
                                component: ResetPasswordPage,
                                params: {...this.props,item:response.data,username:this.state.phone}
                            });
                        } else {
                            this.refs.toast.show('*请输入有效的验证码/或重试！');
                        }

                    });
            }
        }
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
                            onChangeText={(input) => this.setState({phone: input})}>
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
                            onChangeText={(input) => this.setState({forget: input})}>
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
                <Toast
                    ref="toast"
                    style={{backgroundColor:'white'}}
                    position='center'
                    positionValue={100}
                    fadeInDuration={500}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'red'}}
                />
                <View style = {{marginTop:60,width:width,height:50,backgroundColor:'#FFF'}}>

                    <TouchableOpacity onPress={() => { this._shortMessageIdentification()
                        // this.props.navigator.push({
                        //     component: ResetPasswordPage,
                        //     params: {...this.props}
                        // })
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
        backgroundColor:'white',

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