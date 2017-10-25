import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import CustomListView from '../../common/CustomListView'
import SearchPage from '../../page/SearchPage';
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'
import Searchbox from '../../common/Searchbox'


let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRepository = new DataRepository();

export default class DeviceTab extends Component {
    isSelected = false;
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            selectedSystem: this.props.systemList,
            systemList: [],
        }
    }

    /**
     * 根据typeCode，
     * @param typeCode
     * @returns {string}
     * @private
     */
    _getImageIcon(typeCode) {
        let imageIcon;
        switch (typeCode) {
            case '002':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_GGD_nor.png")}/>;
                break;
            case '006':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SMPS_nor.png")}/>;
                break;
            case '007':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_BATT_nor.png")}/>;
                break;
            case '008':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_UPS_nor.png")}/>;
                break;
            case '015':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Conditioners_nor.png")}/>;
                break;
            case '016':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SmartMeter_nor.png")}/>;
                break;
            case '099':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_RKE_nor.png")}/>;
                break;
            case '100':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Cameras_nor.png")}/>;
                break;
            case '107':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SMPS_nor.png")}/>;
                break;
            case '181':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_Infrared_nor.png")}/>;
                break;
            case '182':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_SmokeDetector_nor.png")}/>;
                break;
            case '183':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_THTB_nor.png")}/>;
                break;
            case '184':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_YDN_WDT_nor.png")}/>;
                break;
            case '185':
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_EN_MG_nor.png")}/>;
                break;
            default:
                imageIcon = <Image source={require("../../../res/Image/Monitor/ic_XX_nor.png")}/>;
        }
        return imageIcon
    }

    /**
     * 渲染列表cell
     */
    _renderRow(rowData) {
        return (
            <View style={deviceCellStyles.cell}>

                <View style={deviceCellStyles.cellLeft}>

                    <View>
                        {this._getImageIcon(rowData.typeCode)}
                    </View>

                    <View>
                        <Text style={{fontSize: 14, color: '#444444', paddingLeft: 16}}>{rowData.name}</Text>
                    </View>

                </View>

                <View>
                    {/*{fusOnline}*/}
                </View>
            </View>

        )
    }

    /**
     * 跳转到搜索页面
     * @private
     */
    _pushToSearchPage() {
        this.props.navigator.push({
            component: SearchPage,
            params: {
                title: '请输入设备名称',
                url: this.props.url,
                params: this.props.params,
                renderRow: this._renderRow.bind(this),
                ...this.props
            }
        })
    }
    /**
     * 获取设备系统分类列表
     */
    _getSystemList() {
        let url = '/app/v2/device/system/list';
        let params = {
            stamp: storage.getLoginInfo().stamp,
            siteId: this.props.item.siteId
        };

        dataRepository.fetchNetRepository('POST', url, params).then((result) => {
            this.setState({
                systemList: result.data,
                selectedSystem: result.data[0]
            });
        });
    }

    componentDidMount() {
        this._getSystemList();
    }
    render() {
        let header =
            <View style={deviceCellStyles.searchHeader}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        this.isSelected = !this.isSelected;
                        this.setState({
                            isSelected: this.isSelected
                        })
                    }}>
                    <View style={{
                        padding: 3,
                        // backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#3C7FFC',
                                width: 65,
                            }}>
                            {this.state.selectedSystem}
                        </Text>
                        {
                            this.state.isSelected
                                ? <Image style={{width: 12, height: 6, tintColor: '#3C7FFC'}}
                                         source={require('../../../res/Image/BaseIcon/ic_triangle_up_nor.png')}/>
                                : <Image style={{width: 12, height: 6, tintColor: '#3C7FFC'}}
                                         source={require('../../../res/Image/BaseIcon/ic_triangle_up_nor.png')}/>
                        }
                    </View>
                </TouchableOpacity>

                <View style={{width: width * 0.65}}>
                    <Searchbox
                        {...this.props}
                        onClick={() => {
                            this._pushToSearchPage();
                        }}
                        placeholder={'请输入设备名称'}/>
                </View>
            </View>;
        let selectList =
            this.state.isSelected ? <View style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: 10,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                }}>
                    {
                        this.state.systemList.map((item, i, arr) => {    // .map 中item === arr[i]
                            return <TouchableOpacity
                                key={i}
                                onPress={() => {
                                    this.setState({
                                        selectedSystem: item,
                                    })
                                }}
                                activeOpacity={1}
                                underlayColor='transparent'>

                                {
                                    this.state.selectedSystem === item
                                        ? <View style={deviceCellStyles.selectCell}>
                                            <Text style={{color: '#3C7FFC'}}>{arr[i]}</Text>
                                            <Image
                                                style={{width: 25, height: 25, tintColor: '#3C7FFC'}}
                                                source={require('../../../res/Image/BaseIcon/ic_select.png')}/>
                                        </View>
                                        : <View style={deviceCellStyles.selectCell}>
                                            <Text>{arr[i]}</Text>
                                        </View>
                                }

                            </TouchableOpacity>
                        })
                    }
                </View>
                : null;
        let list =
            <CustomListView
                {...this.props}
                url={this.props.url}
                params={this.props.params}
                alertText={'没有更多数据了~'}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}/>;

        return (
            <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
                {header}
                <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
                    {list}
                    {selectList}
                </View>
            </View>
        )
    }
}

const deviceCellStyles = StyleSheet.create({
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 6
    },
    cell: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 4,
    },
    onlineState: {
        backgroundColor: '#949494',
        // color: '#FFFFFF',
        fontSize: 12,
        // paddingTop: 1,
        // paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectCell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 2,
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#FFFFFF',
    }
});