import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
let {width, height} = Dimensions.get('window');

export default class FsuInfo extends React.Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.state = {
            theme: this.props.theme,
        };
    }

    componentDidMount() {
        // android物理返回监听事件
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        // 卸载android物理返回键监听
        this.backPress.componentWillUnmount();
    }

    /**
     * 点击 android 返回键触发
     * @param e 事件对象
     * @returns {boolean}
     */
    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    _renderLeftButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigator.pop()
                    }}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../../res/Image/Nav/ic_backItem.png')}
                        />
                        {/*<Text>个人</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderContent() {
        let online = this.props.fsuInfo.online
            ? <View style={[styles.onlineState, {backgroundColor: '#3C7FFC'}]}><Text style={styles.operationStateText}>在线</Text></View>
            : <View style={styles.onlineState}><Text style={styles.operationStateText}>离线</Text></View>;
        return (
            <View style={styles.content}>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>站点名称</Text>
                    <Text numberOfLines={2} style={[styles.fsuInfoCellValueText, {width: width* 0.4, textAlign: 'right'}]}>{this.props.siteInfo.name}</Text>
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>状态</Text>
                    {online}
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>经度</Text>
                    <Text style={styles.fsuInfoCellValueText}>{this.props.siteInfo.longitude}</Text>
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>纬度</Text>
                    <Text style={styles.fsuInfoCellValueText}>{this.props.siteInfo.latitude}</Text>
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>FSU厂家</Text>
                    <Text style={styles.fsuInfoCellValueText}>{this.props.fsuInfo.manufacturer}</Text>
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>设备数量</Text>
                    <Text style={styles.fsuInfoCellValueText}>{this.props.fsuInfo.deviceCount}</Text>
                </View>

                <View style={styles.fsuInfoCell}>
                    <Text style={styles.fsuInfoCellKeyText}>所属区县</Text>
                    <Text style={styles.fsuInfoCellValueText}>{this.props.siteInfo.tier}</Text>
                </View>

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
                title={this.props.fsuInfo.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        let content = this._renderContent();
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    content: {
       margin: 16,
    },
    fsuInfoCell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 2,
        paddingTop: 16,
        paddingBottom: 16,
    },
    fsuInfoCellKeyText: {
        fontSize: 14,
        color: '#7E7E7E'
    },
    fsuInfoCellValueText: {
        fontSize: 14,
        color: '#444444',
    },
    onlineState: {
        backgroundColor: '#949494',
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    operationState: {
        backgroundColor: '#949494',
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    operationStateText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});