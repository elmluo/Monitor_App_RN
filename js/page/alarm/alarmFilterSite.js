/**
 * Created by chenht on 2017/10/26.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import StorageClass from '../../common/StorageClass'
import NavigationBar from '../../common/NavigationBar'
import Searchbox from '../../common/Searchbox'
import CustomListView from '../../common/CustomListView'
import DataRepository from '../../expand/dao/Data'
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/Utils'

let storageClass = new StorageClass();
let {width, height} = Dimensions.get('window')
export default class AlarmFilter extends Component {

    selectedArr = [];
    isSelected = false;
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            selectedArr: []
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

    _pushToSearchPage() {
        this.props.navigator.push({
            component: SearchPage,
            params: {
                title: '请输入站点名称',
                url: this.url,
                params: this.params,
                renderRow: this._renderRow.bind(this),
                ...this.props
            }
        });
    }
    _renderRow(rowData, sectionID, rowID, hightlightRow) {
        let fsuOnline =
            rowData.fsuOnline ? <Text style={[styles.onlineState]}>在线</Text>
                : <Text style={styles.onlineState}>离线</Text>;

        let operationState;
        if (rowData.operationState === '工程态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(141, 135, 179)'}]}>工程态</Text>
        } else if (rowData.operationState === '测试态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(136, 121, 232)'}]}>测试态</Text>
        } else if (rowData.operationState === '交维态') {
            operationState = <Text style={[styles.operationState, {backgroundColor: 'rgb(107, 92, 245)'}]}>交维态</Text>
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData);
                }}>
                <View style={styles.row}>
                    <View style={styles.rowTop}>
                        <Text style={styles.name}>{rowData.name}</Text>
                        <View style={styles.rowTopRight}>
                            <Text style={styles.rowTopRightText}>设备数量：</Text>
                            <Text style={styles.rowTopRightText}>{rowData.deviceCount ? rowData.deviceCount : 0}</Text>
                        </View>
                    </View>
                    <View style={styles.rowBottom}>
                        <Text style={styles.tier}>{rowData.tier}</Text>
                        <View style={styles.rowBottomRight}>
                            {operationState}
                            {fsuOnline}
                        </View>
                    </View>
                </View>

            </TouchableOpacity>

        )
    }


    render() {

        let navigationBar =
            <NavigationBar
                title={'站点选择'}

                leftButton={this._renderLeftButton()}
                style={this.state.theme.styles.navBar}/>;

        let content =
            <CustomListView
                {...this.props}
                url={'/app/v2/site/list'}
                params={{
                    stamp: storageClass.getLoginInfo().stamp
                }}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}
                // renderHeader={this._renderHeader.bind(this)}
                alertText={'没有更多数据了~'}/>;


        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.searchBoxWrapper}>
                    <Searchbox
                        placeholder={'请输入站点名称'}
                        onClick={() => {
                            // this._pushToSearchPage();
                        }}
                    />
                </View>

                {content}
            </View>
        )
    }
}
const styles = StyleSheet.create({

});
