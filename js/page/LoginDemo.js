/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import Main from "./Main";
import DataRepository from '../expand/dao/Data.js'
let dataRepository = new DataRepository();

export default class LoginDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }
    _login(){
        let url = '/app/v2/user/login';
        let params = {
            appId: 'YiYi',
            username: 'demo',
            password: '123456'
        };
        // this.props.navigator.push({
        //     component: Main,
        //     params:{
        //         theme: this.theme,
        //         ...this.props
        //     }
        // });
        alert(JSON.stringify(params));
        dataRepository.fetchNetRepository('POST', url, params)
            .then((response)=> {
                // this.props.navigator.push({
                //     component: Main,
                //     params:{
                //         theme: this.theme,
                //         ...this.props
                //     }
                // });

                alert(JSON.stringify(response));

                console.log(this, 123456);

                this.props.navigator.push({
                    component: Main,
                    params:{
                        theme: this.theme,
                        ...this.props
                    }
                });

                dataRepository.saveRepository(url, response.data);

            })
            .catch(error=> {
                console.log(error);
            })
    }
    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'******'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}/>;
        return(
            <View style={styles.container}>
                {navigationBar}
                <Text>测试登录页</Text>
                <Text style={{backgroundColor: 'yellow'}}
                    onPress={()=>{
                        this._login.call(this);
                        // this.props.navigator.push({
                        //     component: Main,
                        //     params: {
                        //         ...this.props,
                        //         theme: this.state.theme
                        //     }
                        // })
                    }}>点我登录</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
