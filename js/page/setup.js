import React, {Component} from 'react'
import {Navigator} from 'react-native-deprecated-custom-components';
// import WelcomePage from './WelcomePage'
import LoginPage from './Login'

function setup() {
    //进行一些初始化配置

    class Root extends Component {
        renderScene(route, navigator) {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator}/>
        }

        render() {
            return <Navigator
                // initialRoute={{component: WelcomePage}}
                initialRoute = {{component: LoginPage}}
                renderScene={(route, navigator)=>this.renderScene(route, navigator)}
            />
        }
    }
    return <Root/>;
}
module.exports = setup;