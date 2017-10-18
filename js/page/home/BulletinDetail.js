/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    InteractionManager
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'

let dataRepository = new DataRepository();
let storage = new Storage();

export default class BulletinDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            notive: {
                noticeId: '123456',
                title: '',
                content: '',

            }
        }
    }

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

    /***
     * 获取公告信息
     * @private
     */
    _getNotice() {
        let url = '/app/v2/notice/get';
        // console.log(this.props);
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            noticeId: this.props.item.noticeId
        };
        alert(params);
        dataRepository.fetchNetRepository('POST', url, params).then((response)=> {
            alert(JSON.stringify(response));
            this.setState({
                notive: response.data,
            })
        })
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'公告详情'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text>公告详情</Text>
            </View>
        )
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            this._getNotice();
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
});
