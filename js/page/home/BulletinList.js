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
    DeviceEventEmitter,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BulletinDetail from './BulletinDetail'
import DataRepository from '../../expand/dao/Data';
import Storage from '../../common/StorageClass';
import CustomListView from "../../common/CustomListView";
import Utils from '../../util/Utils'

let storage = new Storage();
let dataRepository = new DataRepository();

// 获取本地用户存储信息
export default class BulletinList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        }
    }

    /**
     * 渲染navigationBar左侧按钮
     * @returns {XML}
     * @private
     */
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

    /**
     * 渲染Row内容
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param hightlightRow
     * @returns {XML}
     * @private
     */
    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData);

                    // 发送通知： 首页重新获取未读公告数量，
                    DeviceEventEmitter.emit('getNoticeNotReadCount')
                }}>
                <View style={styles.cell}>
                    <View style={styles.cellTop}>
                        <View style={styles.cellTopLeft}>
                            {
                                rowData.read
                                    ? null
                                    :<Image source={require('../../../res/Image/Home/ic_home_dot.png')}/>
                            }
                            <Text style={styles.cellTopLeftTitle}>{rowData.title}</Text>
                        </View>
                        <View style={styles.cellTopRight}>
                            <Text style={styles.cellTopRightTime}>{Utils._Time(rowData.time)}</Text>
                            <Image source={require('../../../res/Image/BaseIcon/ic_listPush_nor.png')}/>
                        </View>


                    </View>
                    <View style={styles.cellBottom}>
                        <Text style={styles.cellBottomText}>{rowData.abstracts}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'公告列表'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;

        let URL = '/app/v2/notice/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            page: 1,
            size: 20,
        };

        let list =  <CustomListView
            {...this.props}
            noDataType={'onData'}
            url={URL}
            params={params}
            renderRow={this._renderRow.bind(this)}   // bind(this)机制需要熟悉
            alertText={'没有更多数据了~'}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                {list}
            </View>
        )
    }

    /**
     * 跳转到公告详情页
     * @private
     */
    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: BulletinDetail,
            params: {
                item: rowData,
                ...this.props,
                theme: this.state.theme
            }
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    cell: {
        marginTop: 4,
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    cellTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cellTopLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellTopLeftTitle: {
        fontSize: 14,
        color: '#444444',
        marginLeft: 12,
    },
    cellTopRight: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellTopRightTime: {
        fontSize: 12,
        color: 'rgba(126,126,126,0.8018568841)'
    },
    cellBottom: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    cellBottomText: {
        fontSize: 12,
        color: '#7E7E7E',
        lineHeight: 19,
    }

});
