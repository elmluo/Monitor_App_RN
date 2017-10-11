/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
export default class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme:this.props.theme,
        }
    }

    _renderLeftButton() {
        return(
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigator.pop();
                    }}>
                    <View style={{padding:5,marginRight:8}}>
                        <Image
                            style={{width:24,height:24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderRightButton() {
        return(
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>{
                        alert('还不能打开地图功能')
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_notice_selected.png')}/>
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
                title={this.props.item.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
                rightButton={this._renderRightButton()}/>;

        return(
            <View style={styles.container}>
                {navigationBar}
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Text>告警详情页</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
