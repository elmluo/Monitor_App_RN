import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar'

export default class FsuInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        };
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
                    <Text style={styles.fsuInfoCellValueText}>{this.props.siteInfo.name}</Text>
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
        color: '#444444'
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