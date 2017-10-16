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
    Alert,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import SiteDetail from '../monitor/SiteDetail'
import ViewUtils from '../../util/ViewUtils'
import LoginPage from '../Login'

// import DataRepository from '../../expand/dao/DataRepository'
export const MORE_INFO = {
    User_Info: '个人信息',
    User_Name: '用户名',
    User_Phone: '手机',
    User_Password: '密码',
    Company: '所在企业',
    Company_Info: '企业信息',
    Company_Name: '企业名称',
    Company_Email: '联系邮箱',

}

let dataRepository = new DataRepository();

export default class MyInfoPage extends Component {
    constructor(props) {
        super(props);
        // 初始化类实例
        //     this.dataRepository = new DataRepository();
        this.state = {
            personInfo: null,
            personCompany: null,
            isLoading: false,
            theme: this.props.theme,
            // dataSource: new ScrollView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
        }
    }

    _onLoad() {
        // 开启加载动画
        this.setState({
            isLoading: true
        });
        let url = '/app/v2/user/info/get';
        let userId = null;
        dataRepository.fetchLocalRepository('/app/v2/user/login').then(result => {
            userId = result.userId;



        let params = {
            stamp: 'Skongtrolink',
            // page: 1,
            userId:userId,
            // size: 20,
        };
        // alert(JSON.stringify(params));

        dataRepository.fetchNetRepository('POST', url, params)
            .then((result) => {
                // alert(JSON.stringify(result));
                this.setState({
                    personInfo: result.data
                });
                let _URL_CompanyInfoGet = '/app/v2/company/info/get';
                let parameters_Company = {
                    companyId:result.data.companyId
                };
                // alert(JSON.stringify(parameters_Company));

                dataRepository.fetchNetRepository('POST', _URL_CompanyInfoGet, parameters_Company)
                    .then(result => {
                        // alert(JSON.stringify(result));

                        this.setState({
                            personCompany: result.data,
                            isLoading: false   // 关闭加载动画
                        });

                    })
                    .catch(error => {
                        this.setState({
                            personCompany: JSON.stringify(error)
                        });
                    })
            })

            .catch(error => {
                this.setState({
                    personInfo: JSON.stringify(error)
                });
            })
        })
    }


    _pushToDetail(rowData) {
        this.props.navigator.push({
            component: SiteDetail,
            params: {
                item: rowData,
                ...this.props
            },
        })
    }


    _pushToLogin() {
        this.props.navigator.push({
            component: LoginPage,
            params: {
                theme: this.theme,
                ...this.props
            },
        })
    }

    componentDidMount() {
        // 组件装载完，获取数据
        this._onLoad()
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

    getItem(tag, text, rightIcon, rightText) {
        return ViewUtils.getCellItem(() => this.onClick(tag), text, rightIcon, rightText);
    }

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
                             this._pushToLogin();
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

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'个人信息'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
                rightButton={this._renderRightButton()}
            />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView
                    style={styles.scrollView}
                    ref='scrollView'
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}  // 水平滚动条控制
                    pagingEnabled={true}
                    refreshControl={
                        <RefreshControl
                            title='加载中...'
                            titleColor={this.state.theme.themeColor}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            refreshing={this.state.isLoading}
                            onRefresh={() => {
                                // 刷新的时候重新获取数据
                                this._onLoad()
                            }}/>
                    }

                >
                    <View style={{flex: 1}}>
                        {/*{个人信息板块}*/}
                        <View style={{position: 'relative', top: 6}}>
                            <View style={styles.cell}>
                                <View style={styles.cellLeft}>

                                    <Image source={require('../../../res/Image/Login/ic_user_hl.png')}
                                           resizeMode='stretch'
                                           style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
                                    <Text style={{fontSize: 16, color: 'rgb(126,126,126)'}}>个人信息</Text>
                                </View>

                            </View>
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Info, '用户名', null, this.state.personInfo?this.state.personInfo.name:'--')}
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Phone, '手机', null, this.state.personInfo?this.state.personInfo.phone:'--')}
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Info, '密码', require('../../../res/Image/BaseIcon/ic_listPush_nor.png'), null)}
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Info, '所在企业', null,  this.state.personCompany?this.state.personCompany.name:'--')}
                        </View>

                        {/*{企业信息板块}*/}
                        <View style={{position: 'relative', marginTop: 10}}>
                            <View style={styles.cell}>
                                <View style={styles.cellLeft}>

                                    <Image source={require('../../../res/Image/Login/ic_company_hl.png')}
                                           resizeMode='stretch'
                                           style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
                                    <Text style={{fontSize: 16, color: 'rgb(126,126,126)'}}>企业信息</Text>
                                </View>

                            </View>
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Info, '企业名称', null, this.state.personCompany?this.state.personCompany.name:'--')}
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Info, '联系邮箱', null, this.state.personCompany?this.state.personCompany.contactsEmail:'--')}
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(243,243,243)'
    },
    cell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 12,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 10,
        paddingBottom: 6,
        // marginBottom: 6,
        backgroundColor: '#FFFFFF',
    },
    cellLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'

    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(235,235,235,1)',
    },
});
