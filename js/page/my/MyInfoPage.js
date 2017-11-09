/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    InteractionManager,
    Dimensions,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import DataRepository from '../../expand/dao/Data'
import ViewUtils from '../../util/ViewUtils'
import LoginPage from '../Login'
import SetPasswordPage from '../my/SetPasswordPage'
import Storage from '../../common/StorageClass'
import JPushModule from 'jpush-react-native';
import CompanyListPage from '../my/CompanyListPage'

let storage = new Storage();
let {width,height} = Dimensions.get('window');
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
        this.dataRepository = new DataRepository();
        this.state = {
            personInfo: null,
            personCompany: null,
            isLoading: false,
            theme: this.props.theme,
        }
    }

    /**
     * 获取信息列表
     */

    _onLoad() {
        // 开启加载动画
        this.setState({
            isLoading: true
        });
        let url = '/app/v2/user/info/get';
        //去缓存中拿 stamp、userId
        dataRepository.fetchLocalRepository('/app/v2/user/login').then(result => {

        let params = {
            stamp: result.stamp,
            userId:result.userId,
        };
        // alert(JSON.stringify(params));
        //获取个人信息
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

                // alert(JSON.stringify(result));
                //获取企业信息
                dataRepository.fetchNetRepository('POST', _URL_CompanyInfoGet, parameters_Company)
                    .then(result => {

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

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            // 组件装载完，获取数据
            this._onLoad()
        });
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
    // cell 封装
    getItem(tag,leftIcon, text, rightIcon, rightText) {
        return ViewUtils.getCellItem(() => this.onClick(tag),leftIcon, text, rightIcon, rightText);
    }
    //修改密码点击时间
    onClick(tab) {
        switch (tab) {
            case MORE_INFO.User_Password:
                this.props.navigator.push({
                    component:SetPasswordPage,
                    params: {
                        theme: this.theme,
                        ...this.props
                    },
                })
                break;

        }
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

    _postCompanyListPage(){
        let companyData = storage.getCompanyData();
        this.props.navigator.push({
            component: CompanyListPage,
            params: {
                theme: this.theme,
                userId:companyData.userId,
                agencyId:companyData.agencyId,
                ...this.props
            },
        })
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
        let isClasses =storage.getIsClasses();
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
                            {this.getItem(null,require('../../../res/Image/Login/ic_user_hl.png'),'个人信息',null,' ')}
                            <View style={styles.line}/>
                            {this.getItem(null, null,'用户名', null, this.state.personInfo?this.state.personInfo.name:'--')}
                            <View style={styles.line}/>
                            {this.getItem(null, null,'手机', null, this.state.personInfo?this.state.personInfo.phone:'--')}
                            <View style={styles.line}/>
                            {this.getItem(MORE_INFO.User_Password, null,'密码', require('../../../res/Image/BaseIcon/ic_listPush_nor.png'), null)}
                            <View style={styles.line}/>
                            {this.getItem(null, null,'所在企业', null,  this.state.personCompany?this.state.personCompany.name:'--')}
                        </View>

                        {/*{企业信息板块}*/}
                        <View style={{position: 'relative', marginTop: 10}}>
                            {this.getItem(null,require('../../../res/Image/Login/ic_company_hl.png'),'企业信息',null,'  ')}
                            <View style={styles.line}/>
                            {this.getItem(null, null,'企业名称', null, this.state.personCompany?this.state.personCompany.name:'--')}
                            <View style={styles.line}/>
                            {this.getItem(null, null,'联系邮箱', null, this.state.personCompany?this.state.personCompany.contactsEmail:'--')}
                        </View>
                        <View style={{position: 'relative', marginTop: 20}}>
                            {isClasses?<TouchableOpacity onPress={() => {
                                this._postCompanyListPage();
                            }}>
                                <View style = {{backgroundColor:'rgb(60,127,252)',left:16,width:width-32,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'}}>
                                    <Text style = {{fontSize:17,textAlign:'center',color:'white'}}>切换企业</Text>
                                </View>

                            </TouchableOpacity>:<View></View>}

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
