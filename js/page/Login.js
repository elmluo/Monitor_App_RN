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

import NavigationBar from '../common/NavigationBar'
import Main from './Main'
import SearchPage from './SearchPage'
import DataRepository from '../expand/dao/Data'
let dataRepository = new DataRepository();
let Dimensions = require('Dimensions');
let {width,height} = Dimensions.get('window');
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state={
            username: '',
            userpwd: '',
        }
    }

    loginInMainPage() {
        let url = '/app/v2/user/login';
        let params = {
            appId: 'YiYi',
            username: this.state.username,
            password: this.state.userpwd
        };
        dataRepository.fetchNetRepository('POST', url, params)
            .then((response)=> {
                if (response['success'] === true){

                    // 保存用户登录信息
                    dataRepository.saveRepository('user', params)
                        .then(()=> {
                            // console.log('用户信息已经保存');
                        });

                    // 保存用户登录后返回信息
                    dataRepository.saveRepository(url, response.data)
                        .then(()=>{
                            this._pushToMainPage();
                        })
                        .catch(error=>{
                            alert(error)
                        });
                } else {
                    console.log('获取数据失败')
                }
            })
            .catch(error=> {
                console.log(error);
            })
    }

    /**
     * 路由到主页面
     * @private
     */
    _pushToMainPage() {
        this.props.navigator.replace({
            component: Main,
            params:{
                theme: this.theme,
                ...this.props
            }
        });
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
                    <View style={styles.item}><Image source={require('../../res/Image/Login/ic_user_key_nor.png')} style={styles.iconKeyStyle}/>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholder="请输入用户名"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({username: input})}>
                        </TextInput>
                    </View>
                    <View style={styles.item}><Image source={require('../../res/Image/Login/ic_password_key_nor.png')} style={styles.iconKeyStyle}/>
                        <TextInput
                            ref="inputLoginPwd"
                            underlineColorAndroid="transparent"
                            placeholder="请输入密码"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            secureTextEntry={true}
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({userpwd: input})}>
                        </TextInput>
                    </View>
                </View>
            </ImageBackground>

            <ImageBackground style={styles.loginBtnBgImg} source={require('../../res/Image/Login/ic_loginBtn_bg.png')} >

                <TouchableOpacity style={styles.login}
                                  underlayColor='transparent'
                                  onPress={()=> {this.loginInMainPage()}}>
                    <Text style={styles.loginText}>登录</Text>
                </TouchableOpacity>
            </ImageBackground>
            <Text style={styles.textNo}>忘记密码|服务器设置</Text>


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
        marginTop:85,
        width: width * 0.7,
        height: 40,
        alignSelf: 'center',

    },
    iconKeyStyle:{
        left:34,
        marginTop:20,


    },
    textInputSize:{
        marginTop:20,
        left:50,
        width:width*0.6,
        height:30,
        textAlign:'left'
    },
    textNo:{
        color: 'rgb(102,102,102)',
        marginTop:width * 0.40,
        fontSize:15,
    },



});
