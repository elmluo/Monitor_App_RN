/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,

} from 'react-native'

console.log(View);
// import NavigationBar from '../../common/NavigationBar'

let Dimensions = require('Dimensions');
let {width,height} = Dimensions.get('window');
export default class Login extends Component {
    constructor(props) {
        super(props);
    }
    loginInMainpage() {
        // this.refs.inputLoginName.blur();
        // this.refs.inputLoginPwd.blur();
        // this.props.navigator.resetTo({
        //     component: MainPage,
        //     params: {
        //         logNmae: this.state.username,
        //         logPwd: this.state.userpwd,
        //         parentComponent: this,
        //         ...this.props
        //     },
        // });
    }


    /*设置背景图片*/

    render() {
        return (<View style={styles.container}>

            <ImageBackground style={styles.bgImageSize}
                   source={require('../../res/Image/Login/ic_login_bg.png')}>
                <Image style={styles.loginImg}
                       source={require('../../res/Image/Login/ic_login_logo.png')}/>
                <Text style={styles.logoText}>义益云监控</Text>

                <View style = {styles.loginTextBg}>
                    <View style={styles.item}><Text style={styles.textStyle}>用户帐号：</Text>
                        <TextInput
                            ref="inputLoginName"
                            autoFocus={true}
                            underlineColorAndroid="gray"
                            placeholder="请输入用户名"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1}}
                            onChangeText={(input) => this.setState({username: input})}
                        > </TextInput>
                    </View>
                    <View style={styles.item}><Text style={styles.textStyle}>用户密码：</Text>
                        <TextInput
                            ref="inputLoginPwd"
                            underlineColorAndroid="gray"
                            placeholder="请输入密码"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={{flex: 1}}
                            onChangeText={(input) => this.setState({userpwd: input})}> </TextInput>
                    </View>
                </View>
            </ImageBackground>

            <ImageBackground style={styles.loginBtnBgImg} source={require('../../res/Image/Login/ic_loginBtn_bg.png')} >

                <TouchableOpacity style={styles.login}
                                  underlayColor='transparent'
                                  onPress={() => this.loginInMainpage()}>

                    <Text style={styles.loginText}>登录</Text>

                </TouchableOpacity>
            </ImageBackground>

        </View>)
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        alignItems:'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,

    },
    textStyle: {
        fontSize: 18,
        color: 'black',
        marginRight: 10
    },
    login: {
        height: 40,
        // backgroundColor: 'green',
        // margin: 20,
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#FFF'
    },
    bgImageSize:{
        marginTop:0,
        left:0,
        right:0,
        width:width,
        height:height*0.5,
    },
    loginImg:{
        marginTop:60,
        alignSelf: 'center',

    },
    logoText:{
        fontSize:20,
        color: '#FFF',
        textAlign:'center',
        marginTop: 30,
        fontWeight: '600'
    },
    loginTextBg:{
        backgroundColor: 'white',
        alignSelf:'center',
        width: width - 30,
        height: height * 0.3,
        marginTop:49,
        borderRadius: 5,
        shadowColor:'rgba(19,171,228,0.25)',
        shadowOffset:{h:15,w:20},
        shadowRadius:20,
        shadowOpacity:0.5,

    },
    loginBtnBgImg:{
        marginTop:15,
        width: width * 0.7,
        height: 40,
        alignSelf: 'center',

    }


});