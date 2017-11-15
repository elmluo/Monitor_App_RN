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
    InteractionManager,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'
import Utils from '../../util/Utils'

let dataRepository = new DataRepository();
let storage = new Storage();

export default class BulletinDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            notice: {
                title: '',
                abstracts: '',
                content: '',
                time: '',
                user: '',
                uniqueCode: '',
            }
        }
    }

    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.pop();
                        DeviceEventEmitter.emit('custom_listView');

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
        dataRepository.fetchNetRepository('POST', url, params).then((response)=> {
            // console.log(response);
            if (response.success === true) {
                this.setState({
                    notice: response.data,
                })
            }
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
                <ScrollView
                    ref='scrollView'>
                    <View style={styles.noticeDetail}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{this.state.notice.title}</Text>
                        </View>
                        <View style={styles.subtitle}>
                            <Text style={styles.subtitleText}>
                                {Utils._Time(this.state.notice.time)}     {this.state.notice.user}
                            </Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.contentText}>{this.state.notice.content}</Text>
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(()=> {
            this._getNotice();
        // })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    noticeDetail: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    title: {},
    titleText: {
        fontSize: 24,
        color: '#444444'
    },
    subtitle: {
        marginTop: 17,
    },
    subtitleText: {
        color: 'rgba(126,126,126,0.8)',
        fontSize: 14,
    },
    content: {
        marginTop: 33,
    },
    contentText: {
        color: 'rgba(68,68,68,0.9)',
        fontSize: 14,
    }

});
