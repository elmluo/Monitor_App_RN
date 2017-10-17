/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinDetail from './BulletinDetail'
export default class BulletinList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme:this.props.theme,
        }
    }

    /**
     * 渲染navigationBar左侧按钮
     * @returns {XML}
     * @private
     */
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


    render() {
        let statusBar={
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'公告列表'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        return(
            <View style={styles.container}>
                {navigationBar}
                <Text>公告列表</Text>
                <TouchableOpacity
                    onPress={()=>{
                    this.props.navigator.push({
                        component: BulletinDetail,
                        params: {...this.props}
                    });
                }}>
                    <Text style={{backgroundColor: 'yellow'}}>
                        点击进入详情页
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
});
