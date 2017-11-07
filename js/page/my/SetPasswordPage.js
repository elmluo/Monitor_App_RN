import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Btn from '../my/BaseBtn'
import DataRepository from '../../expand/dao/Data'
import Storage from '../../common/StorageClass'
import Toast, {DURATION} from 'react-native-easy-toast';

let storage = new Storage();
let dataRepository = new DataRepository();
let {width, height} = Dimensions.get('window')
export default class SetPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            btnText: '确定',
            userPassword:'',
            newPassword:'',
            twoNewPassword:'',
        };

    }

    //返回按钮
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

    _setPassword() {

        // console.log(storage.getUserInfo());

        let url = '/app/v2/user/password/modify';
        let params = {
            userId: storage.getLoginInfo().userId,
            oldPassword: storage.getUserInfo().password,
            newPassword: this.state.newPassword,
        };
        // alert(JSON.stringify(response.data));
        if (this.state.userPassword.length === 0) {
            this.refs.toast.show('*请输入原密码');
        } else {

            if (this.state.newPassword.length === 0){
                this.refs.toast.show('*请输入新密码');

            }else {
                if (storage.getUserInfo().password !== this.state.userPassword) {
                    this.refs.toast.show('*与原密码不一致');
                } else {
                    if (/^[0-9a-zA-Z_]{1,}$/.test(this.state.newPassword) && this.state.newPassword.length > 5 && this.state.newPassword.length < 21) {

                        if (this.state.newPassword !== this.state.twoNewPassword) {
                            this.refs.toast.show('*两次输入密码不一致');

                        } else {
                            if (this.state.newPassword === this.state.userPassword) {
                                this.refs.toast.show('*不能与原密码相同');

                            } else {
                                dataRepository.fetchNetRepository('POST', url, params)
                                    .then((response) => {
                                        if (response.success === true) {
                                            let userInfo = {
                                                username:storage.getUserInfo().username,
                                                password:this.state.newPassword,
                                            }
                                            storage.setUserInfo(userInfo);
                                            dataRepository.saveRepository('user', userInfo)
                                                .then(() => {
                                                    console.log('用户信息已经保存');
                                                    this.props.navigator.pop();
                                                });
                                        } else {
                                            this.refs.toast.show('*设置失败请重试');
                                        }

                                    });
                            }
                        }

                    } else {
                        this.refs.toast.show('*输入长度为6~20的字母/数字/下划线');
                    }
                }
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
                title={'重置密码'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
            />;
        return (

            //重置密码界面
            <View style={styles.container}>
                {navigationBar}

                <View style={{marginTop: 49}}>
                    <View style={styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#7E7E7E'
                            placeholder="请输入旧密码"
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({userPassword: input})}>
                        </TextInput>
                    </View>
                    <View style={styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#7E7E7E'
                            placeholder="请输入新密码"
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({newPassword: input})}>
                        </TextInput>
                    </View>
                    <View style={styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholder="请再输入一次密码"
                            placeholderTextColor='#7E7E7E'
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({twoNewPassword: input})}>
                        </TextInput>
                    </View>
                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'white'}}
                    position='bottom'
                    positionValue={80}
                    fadeInDuration={500}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'red'}}
                />
                <View style={{marginTop: 60, width: width, height: 50, backgroundColor: '#FFF'}}>


                    <TouchableOpacity onPress={this._setPassword.bind(this)}>
                        <Btn text={this.state.btnText}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    textInputViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(235,235,235)'

    },
    textInputSize: {
        marginTop: 20,
        height: 50,
        width: width - 60,
        textAlign: 'left',

    }
});