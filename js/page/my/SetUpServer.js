import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    Alert,
    Text,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Btn from '../my/BaseBtn'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'
import DeviceInfo from 'react-native-device-info'

let storage = new Storage();
let dataRepository = new DataRepository();
let {width, height} = Dimensions.get('window')
export default class SetUpServer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            btnText: '确定'
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

    _setSeverIP(IP) {
        let dismissKeyboard = require('dismissKeyboard');
        dismissKeyboard();
        let url = IP + '/app/timestamp';
        //进行登录
        // console.log('进入设置IP'+url);

        this.fetchNetRepository('POST', url, null)
            .then((response) => {
                if (response.success == true) {
                    //设置成功后保存到本地并且更新单例中ip
                    Alert.alert(
                        '设置成功',
                        ''
                            [
                            {
                                text: '确认', onPress: () => {
                            }
                            }

                            ]
                    );

                    dataRepository.saveRepository('Environment_Domain', IP)
                        .then(() => {
                            storage.setServerAddress(IP);
                            this.props.navigator.pop();
                        })

                } else {
                    Alert.alert(
                        '输入服务器地址不正确/请重试',
                        ''
                            [
                            {
                                text: '确认', onPress: () => {
                            }
                            }

                            ]
                    );

                }
            })
            .catch(error => {
                // console.log(error);
                Alert.alert(
                    '输入服务器地址不正确/请重试',
                    ''
                        [
                        {
                            text: '确认', onPress: () => {
                        }
                        }

                        ]
                );
            })

    }

    fetchNetRepository(method, url, params) {
        // console.log(url);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(response => response.json())
                .then(json => {
                    resolve(json);
                })
                .catch(error => {
                    reject(error);
                    // console.log(error);
                })
        })
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'设置服务器地址'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
            />;
        return (

            //设置服务器地址
            <View style={styles.container}>
                {navigationBar}
                <View style={{height: (height - 64), justifyContent: 'space-between'}}>
                    <View style={{height: height * 0.3, backgroundColor: 'white', marginTop: 49}}>
                        <View style={styles.textInputViewStyle}>
                            <TextInput
                                ref="inputLoginName"
                                // autoFocus={true}
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#7E7E7E'
                                placeholder="请输入服务器地址"
                                clearTextOnFocus={false}
                                clearButtonMode="while-editing"
                                style={styles.textInputSize}
                                defaultValue={storage.getServerIP() ? storage.getServerIP() : ''}
                                onChangeText={(input) => this.setState({serverIp: input})}>
                            </TextInput>

                        </View>

                        <View style={{marginTop: 60, width: width, height: 50, backgroundColor: '#FFF'}}>


                            <TouchableOpacity onPress={() => {
                                let Ip = this.state.serverIp ? this.state.serverIp : storage.getServerIP()
                                this._setSeverIP(Ip);
                            }}>
                                <Btn text={this.state.btnText}/>
                            </TouchableOpacity>

                        </View>

                    </View>


                    <View style={{width: width, height: 50, backgroundColor: 'white'}}>
                        <Text style={{
                            fontSize: 16,
                            color: 'black',
                            textAlign: 'center'
                        }}>{"版本号:" + DeviceInfo.getVersion()}</Text>
                    </View>
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