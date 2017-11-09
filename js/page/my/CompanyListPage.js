/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import MainPage from '../Main'
import ViewUtils from '../../util/ViewUtils'
import JPushModule from 'jpush-react-native'
import Storage from '../../common/StorageClass'
import LoginPage from '../Login'

let storage = new Storage();
let dataRepository = new DataRepository();

export default class CompanyListPage extends Component {
    constructor(props) {
        super(props);
        // 初始化类实例
        this.dataRepository = new DataRepository();
        this.state = {
            isLoading: false,
            personCompany: null,
            theme:this.props.theme,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
        }
    }
    //设置返回按钮
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
    //初始化退出登录按钮
    _renderRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => Alert.alert(
                        '是否退出登录',
                        null,
                        [
                            {text: '取消', onPress: () => console.log('Foo Pressed!')},
                            {text: '退出', onPress:() => {
                                ///退出登录操作
                                this._clearData();

                            }},
                        ]
                    )}>
                    <View style={{padding: 5, marginRight: 8}}>
                        <Text style={{color: 'white', fontSize: 14}}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _onLoad() {
        // 开启加载动画
        this.setState({
            isLoading: true
        });


        dataRepository.fetchLocalRepository('/app/v2/user/login').then(result => {
            let url = '/app/v2/company/customer/list';


            let params = {
                agencyId: this.props.agencyId,

            };
            this.dataRepository.fetchNetRepository('POST', url, params)
                .then(result => {
                    console.log(JSON.stringify(result));
                    this.setState({
                        result: JSON.stringify(result),
                        personCompany: result.data,
                        dataSource: this.state.dataSource.cloneWithRows(result.data),  // 实时跟新列表数据源
                        isLoading: false   // 关闭加载动画
                    })
                })
                .catch(error => {
                    this.setState({
                        result: JSON.stringify(error)
                    });
                })

        })


    }
    //调用封装好的cell 组件
    getItem(leftIcon, text, rightIcon, rightText) {
        return ViewUtils.getCompanyCellItem(leftIcon, text, rightIcon, rightText);
    }
    //点击事件
    onClick(tab) {

    }

    //清空缓存数据
    _clearData(){
        this.dataRepository.removeLocalRepository('user');
        this.dataRepository.removeLocalRepository('/app/v2/user/info/get')
            .then(()=> {
                //删除注册的推送
                JPushModule.deleteAlias((result)=>{
                    // console.log('清除成功');
                });
                this._pushToLogin();

            });
    }
    //调转登录页面
    _pushToLogin() {
        this.props.navigator.resetTo({
            component: LoginPage,
            params: {
                theme: this.theme,
                ...this.props
            },
        })
    }
    _renderRow(rowData, sectionID, rowID, hightlightRow) {

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    this._pushToDetail(rowData)
                }}>
                    <View style={styles.container}>
                        <View style = {{position: 'relative', marginTop: 10}}>
                        {this.getItem(require('../../../res/Image/Login/ic_company_hl.png'),rowData.name?rowData.name:'--',null,' ')}
                        <View style={styles.line}/>
                        {this.getItem(null, '用户名', null, rowData.contactsName?rowData.contactsName:'--')}
                        <View style={styles.line}/>
                        {this.getItem(null, '手机', null,rowData.contactsPhone?rowData.contactsPhone:'--')}
                        <View style={styles.line}/>
                        {this.getItem(null,'联系邮箱', null, rowData.contactsEmail?rowData.contactsEmail:'--')}
                        </View>

                    </View>

            </TouchableOpacity>

        )
    }
    /***
     * 推送注册
     * @param rowData
     * @private
     */
    _JPushSetAlias(rowData) {

        let alias = this.props.userId;
        // alert(JSON.stringify(alias));
        if (alias !== undefined) {
            JPushModule.setAlias(alias, () => {
                console.log("Set alias succeed", alias);
            }, () => {
                console.log("Set alias failed");
            });
        }
        storage.setIsClasses(true);
        this.props.navigator.push({
            component: MainPage,
            params:{
                item: rowData,
                ...this.props
            },
        })


    }
    //跳转home 页面
    _pushToDetail(rowData) {
        //进行数据处理
        this._setUserData(rowData);
    }

    _setUserData(rowData){
        dataRepository.saveRepository('/app/v2/user/login', {
            companyId: rowData.companyId,
            stamp: rowData.stamp,
            userId: this.props.userId
        })
            .then(() => {
                this._JPushSetAlias(rowData);
            })
            .catch(error => {
                alert(error)
            });

    }

    componentDidMount() {
        // 组件装载完，获取数据
        this._onLoad()
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'监控页面'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                rightButton={this._renderRightButton()}/>;
        return(
            <View style={styles.container}>
                {navigationBar}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    refreshControl={
                        <RefreshControl
                            title='加载中...'
                            titleColor={this.state.theme.themeColor}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            refreshing={this.state.isLoading}
                            onRefresh={()=>{
                                // 刷新的时候重新获取数据
                                this._onLoad()
                            }}/>
                    }/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(243,243,243)'
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EBEBEB',
        marginLeft: 16,
        padding: 15,
        paddingLeft: 0,
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7
    },
    name: {
        color: '#444444',
        fontSize: 14
    },
    deviceCount: {
        color: '#7E7E7E',
        fontSize: 12
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    onlineState: {
        backgroundColor: '#949494',
        color: '#FFFFFF',
        fontSize: 12,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    tier: {
        fontSize: 12,
        color: '#7E7E7E',
        marginLeft: 8
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(235,235,235,1)',
    },

});
