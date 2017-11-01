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
    Dimensions,
    DeviceEventEmitter
} from 'react-native'
import StorageClass from '../../common/StorageClass'
import NavigationBar from '../../common/NavigationBar'
import Searchbox from '../../common/Searchbox'
import SearchPage from '../SearchPage'
import CustomListView from '../../common/CustomListView'
import DataRepository from '../../expand/dao/Data'
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/Utils'

let storageClass = new StorageClass();
let {width, height} = Dimensions.get('window')
export default class AlarmFilterSite extends Component {

    selectedArr = [];
    isSelected = false;
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            selectedArr: [],
            siteList: []
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

    componentDidMount() {
        this.state.siteList = [].concat(this.props.siteList);
        DeviceEventEmitter.emit('custom_listView');
    }
    render() {
        let scope = this;

        let siteInList = (site, list)=>{
            let index;
            var l = list.filter((v, i)=>{
                if (v.siteId === site.siteId) {
                    index = i
                }
                return v.siteId === site.siteId;
            });

            return l.length > 0 ? {index: index}: false;
        }


        let _pushToSearchPage = () => {

            scope.props.navigator.push({
                component: SearchPage,
                params: {
                    title: '请输入站点名称',
                    url: '/app/v2/site/list',
                    params: {
                        stamp: storageClass.getLoginInfo().stamp
                    },
                    renderRow: _renderRow('search').bind(scope),
                    ...scope.props
                }
            });
        }

        let _renderRow = (type) => {
            return (rowData, sectionID, rowID, hightlightRow) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            let itr;
                            if (itr = siteInList(rowData, scope.state.siteList)) {
                                itr = itr.index
                                scope.state.siteList.splice(itr, 1);
                            } else {
                                scope.state.siteList.push(rowData);
                            }
                            if (type !== 'search') {
                                scope.setState({});
                            } else {
                                const routes = this.props.navigator.state.routeStack;
                                this.props.navigator.popToRoute(routes[2]);
                            }
                        }}>
                        <View style={[styles.row, (siteInList(rowData, scope.state.siteList)  ? {backgroundColor: "rgba(235,235,235,1)"}:{})]}>
                            <View style={styles.rowTop}>
                                <Text style={styles.name}>{rowData.name}</Text>
                            </View>
                            <View style={styles.rowBottom}>
                                <Text style={styles.tier}>{rowData.tier}</Text>
                                <View style={styles.rowBottomRight}>
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>)

            }
        }

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
                renderRow={_renderRow()}
                // renderHeader={this._renderHeader.bind(this)}
                alertText={'没有更多数据了~'}/>;


        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.searchBoxWrapper}>
                    <Searchbox
                        placeholder={'请输入站点名称'}
                        onClick={() => {
                            _pushToSearchPage();
                        }}
                    />
                </View>

                {content}


                <TouchableOpacity style = {{backgroundColor: "#FFFFFF"}}
                                  activeOpacity={0.5}
                                  onPress= {()=>{
                                      this.props.selecteSite(this.state.siteList);
                                      this.props.navigator.pop();
                                  }}>
                    <Text style = {{padding: 14, textAlign: 'center', fontSize: 16}}>确定</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    searchBoxWrapper: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 6,
        backgroundColor: '#FFFFFF'
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        backgroundColor: '#FFFFFF',
        paddingLeft: 16,
        padding: 15,
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7
    },
    rowTopRight: {
        width: 90,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    name: {
        color: '#444444',
        fontSize: 14
    },
    rowTopRightText: {
        color: '#7E7E7E',
        fontSize: 12,
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBottomRight: {
        flexDirection: 'row'
    },
    tier: {
        fontSize: 12,
        color: '#7E7E7E',
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
    }
});
