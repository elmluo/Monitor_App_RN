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
import SignalList from './SiteDetailSignalList';
let {width, height} = Dimensions.get('window');
let storage = new Storage();
let dataRepository = new DataRepository();

export default class DeviceTab extends Component {

    isSelected = false;

    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            selectedSystem: '',
            systemList: [],
        }
    }

    /**
     * 路由跳转到信号列表
     * @private
     */
    _pushToSignalList(rowData) {
        this.props.navigator.push({
            component: SignalList,
            params: {
                deviceInfo: rowData,
                ...this.props
            }
        })
    }

    /**
     * 渲染列表cell
     */
    _renderRow(rowData) {
        return (
            <TouchableOpacity
                onPress={()=> {
                    this._pushToSignalList(rowData)
                }}>
                <View style={styles.cell}>
                    <View style={styles.cellLeft}>
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
            </TouchableOpacity>

        )
    }

    /**
     * 设备列表
     * @returns {XML}
     * @private
     */
    _renderListView() {
        let params = this.props.params;
        params.system = this.state.selectedSystem;
        return (
            <CustomListView
                {...this.props}
                url={this.props.url}
                params={params}
                alertText={'没有更多数据了~'}
                // bind(this)机制需要熟悉
                renderRow={this._renderRow.bind(this)}
            />
        )
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
            // alert(JSON.stringify(result.data));

            // 默认显示系统列表下第一个系统下设备
            let params = this.props.params;
            params.system = result.data[0];
            this.setState({
                systemList: result.data,
                selectedSystem: result.data[0],
                params: params,
            });
        });
    }

    /**
     * 渲染tab页头部内容
     * @returns {XML}
     * @private
     */
    _renderHeader() {
        return (
            <View style={styles.searchHeader}>

                {/*选择按钮*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        // 遮罩层的显示和隐藏
                        this.isSelected = !this.isSelected;
                        this.setState({
                            isSelected: this.isSelected
                        })
                    }}>
                    <View style={styles.selectBtn}>
                        <Text numberOfLines={1} style={styles.selectBtnText}>
                            {this.state.selectedSystem}
                        </Text>

                        {/*点击变换不同的三角形*/}
                        {
                            this.state.isSelected
                                ? <Image style={{width: 12, height: 6, tintColor: '#3C7FFC'}}
                                         source={require('../../../res/Image/BaseIcon/ic_triangle_up_nor.png')}/>
                                : <Image style={{width: 12, height: 6, tintColor: '#3C7FFC'}}
                                         source={require('../../../res/Image/BaseIcon/ic_triangle_up_nor.png')}/>
                        }
                    </View>
                </TouchableOpacity>

                {/*搜索组件*/}
                <View style={{width: width * 0.65}}>
                    <Searchbox
                        placeholder={'请输入设备名称'}
                        {...this.props}
                        onClick={() => {
                            this._pushToSearchPage();
                        }}/>
                </View>
            </View>
        )
    }

    /**
     * 渲染select下拉菜单
     * @returns {XML}
     */
    _renderSelectOptionList() {
        return (
            <View style={styles.selectList}>
                <View>
                    {
                        this.state.systemList.map((item, i, arr) => {
                            return <TouchableOpacity
                                key={i}
                                activeOpacity={1}
                                underlayColor='transparent'
                                onPress={() => {
                                    this.isSelected = false;
                                    this.setState({
                                        isSelected: this.isSelected,
                                        selectedSystem: item,
                                    });
                                }}>
                                {
                                    this.state.selectedSystem === item
                                        ? <View style={styles.selectCell}>
                                            <Text style={{color: '#3C7FFC'}}>{arr[i]}</Text>
                                            <Image style={{width: 25, height: 25, tintColor: '#3C7FFC'}}
                                                   source={require('../../../res/Image/BaseIcon/ic_select.png')}/>
                                        </View>
                                        : <View style={styles.selectCell}>
                                            <Text>{arr[i]}</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        })
                    }
                </View>

                {/*半透明遮罩层部分*/}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', flex: 1,}}
                    onPress={() => {
                        // 关闭optionList
                        this.isSelected = false;
                        this.setState({
                            isSelected: this.isSelected,
                        });
                    }}>
                </TouchableOpacity>

            </View>
        )
    }

    render() {
        let selectList = this.state.isSelected ? this._renderSelectOptionList() : null;
        let list = this._renderListView();

        return (
            <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
                {this._renderHeader()}
                <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
                    {list}
                    {selectList}
                </View>

                {/*<Text>{JSON.stringify(this.state.params)}</Text>*/}
            </View>
        )
    }

    /**
     * 组件渲染完成钩子
     */
    componentDidMount() {
        this._getSystemList();
    }
}

const styles = StyleSheet.create({
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
    selectBtn: {
        padding: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectBtnText: {
        color: '#3C7FFC',
        width: 65,
    },
    selectList: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 10,
        position: 'absolute',
        top: 0,
        bottom: 0,
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