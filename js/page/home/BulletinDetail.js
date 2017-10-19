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
    ScrollView,
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import Storage from '../../common/StorageClass'
import DataRepository from '../../expand/dao/Data'

let dataRepository = new DataRepository();
let storage = new Storage();

export default class BulletinDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            notice: {
                noticeId: '123456',
                title: '',
                content: '',
                time: '',
                user: '',
            }
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

    /***
     * 获取公告信息
     * @private
     */
    _getNotice() {
        let url = '/app/v2/notice/get';
        // console.log(this.props);
        let params = {
            stamp: storage.getLoginInfo().stamp,
            userId: storage.getLoginInfo().userId,
            noticeId: this.props.item.noticeId
        };
        alert(params);
        dataRepository.fetchNetRepository('POST', url, params).then((response)=> {
            alert(JSON.stringify(response));
            this.setState({
                notice: response.data,
            })
        })
    }








    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'公告详情'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView
                    ref='scrollView'>
                    <View style={styles.noticeDetail}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>公告标题</Text>
                        </View>
                        <View style={styles.subtitle}>
                            <Text style={styles.subtitleText}>
                                2017-07-10   超哥哥
                            </Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.contentText}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab accusamus accusantium dolorum, ducimus id impedit laudantium libero magnam, natus praesentium provident quaerat quisquam quos sed sint suscipit voluptates! Cupiditate illum iusto minima nisi numquam ullam velit voluptatibus. Beatae ipsam laborum, nostrum quod reiciendis repellendus temporibus. Assumenda atque corporis dolorem ducimus esse et fuga fugiat illum laboriosam maiores molestias provident quia quos, repellendus sequi tempora ullam, velit vero. Beatae deserunt illo magni molestiae similique voluptatem! Commodi debitis delectus dicta distinctio dolores eum exercitationem facere fuga ipsa laudantium maxime, obcaecati officiis quisquam reiciendis, repellendus saepe, sed. Corporis deserunt dolore, earum eos ipsum molestiae nemo porro repudiandae. Accusamus alias aspernatur assumenda esse illo labore maiores necessitatibus sapiente sed sit. Asperiores cum cumque deleniti dolore doloribus iure voluptatem! Aliquam beatae delectus deleniti dolor ea eaque eius enim eos facere harum illum impedit in ipsa iure laudantium, molestiae mollitia nihil nostrum odio officia placeat porro praesentium, quibusdam quidem quisquam quos ratione recusandae saepe, sequi sit sunt tempore vel veniam? Aperiam, architecto dolorem dolores dolorum earum eveniet exercitationem facilis fugit, illum inventore ipsum itaque molestiae, nisi pariatur perferendis possimus quae sed suscipit tempora voluptates! Dolore doloremque eius eum id itaque laboriosam placeat quisquam quod ut!
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium alias amet blanditiis consectetur consequatur cupiditate delectus deleniti ducimus error est eveniet facilis impedit in itaque laborum magnam molestias nam necessitatibus optio placeat, possimus quia quis quisquam quos reiciendis repellat repellendus repudiandae rerum saepe sed sequi sit ullam. At dicta dignissimos dolorem ea illum, nostrum obcaecati officia optio pariatur quam qui quibusdam quidem quod recusandae rem, similique sunt voluptates. Deleniti expedita nemo odit provident quibusdam suscipit tenetur vitae! Aperiam consectetur cumque est, hic, ipsa laudantium nam omnis optio possimus quo repellat saepe, temporibus tenetur ullam voluptatem? Asperiores consectetur iste maiores, molestiae nesciunt praesentium quos ratione repellendus! Distinctio dolores expedita ipsa itaque minus nostrum pariatur quam sequi sit voluptatem. Ad atque beatae consequatur culpa cupiditate deserunt dignissimos ea eligendi, enim esse expedita facere facilis id impedit ipsam iste itaque labore magnam magni maiores mollitia necessitatibus nostrum obcaecati odio odit qui, quos rem reprehenderit rerum sapiente sed sint tempora tempore temporibus vel veritatis voluptatibus. Accusamus architecto consequuntur enim explicabo fugiat illo iste magnam magni maxime, nobis odio quam qui voluptatem! Hic id molestiae nesciunt, quas quisquam repellat vel voluptatum? Architecto cumque dolorem fugiat laborum obcaecati ullam. Aut quod sapiente sequi ut veritatis.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            this._getNotice();
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    noticeDetail: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    title: {},
    titleText: {
        fontSize: 24,
        color: '#444444'
    },
    subtitle: {
        marginTop: 17,
    },
    subtitleText: {
        color: 'rgba(126,126,126,0.8)',
        fontSize: 14,
    },
    content: {
        marginTop: 33,
    },
    contentText: {
        color: 'rgba(68,68,68,0.9)',
        fontSize: 14,
    }

});
