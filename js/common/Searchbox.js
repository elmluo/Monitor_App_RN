/**
 * ******** 搜索条 ********
 * props
 *   placeholder: 默认显示文字
 *   onClick： 如果传入改属性方法，则搜索框之后样式，可以进行点击事件； 如果不传改方法，则为正常搜索框。
 *   onSearch： 触发搜索事件
 */


import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

let {width} = Dimensions.get('window');

export default class Searchbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let searchBox;
        if (this.props.onClick) {
            searchBox =
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.props.onClick}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#F3F3F3',
                                width: '100%',
                                alignItems: 'center',
                                height: 28,
                                borderRadius: 2
                            }}>
                            <Image
                                style={{width: 15, height: 15, marginLeft: 16, marginRight: 15}}
                                source={require('../../res/Image/BaseIcon/ic_search_nor.png')}/>
                            <Text style={{color: '#9C9C9C', fontSize: 12}}>
                                {this.props.placeholder}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
        } else {
            searchBox =
                <View onPress={this.props.onClick}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#F3F3F3',
                        width: '100%',
                        alignItems: 'center',
                        borderRadius: 2
                    }}>
                        <Image
                            style={{width: 10, height: 10, marginLeft: 16, marginRight: 15}}
                            source={require('../../res/Image/BaseIcon/ic_search_nor.png')}/>

                        <TextInput
                            placeholder={this.props.placeholder}
                            underlineColorAndroid='transparent'
                            editable={this.state.editable}
                            caretHidden={this.state.caretHidden}
                            style={styles.TextInput}
                            autoFocus={this.props.autoFocus ? this.props.autoFocus : false}
                            onChangeText={(text) => {
                                // 实时监测输入内容存入状态机
                                this.setState({
                                    searchText: text
                                })
                            }}
                            value={this.state.searchText}/>

                        <TouchableOpacity
                            onPress={() => {
                                // 如果有内容输入,用trim()去掉空字符。
                                // 调用方法，并且将搜索内容传递出去
                                if (this.state.searchText === undefined || this.state.searchText === '') {
                                    return
                                } else {
                                    if (this.state.searchText.trim() === '') {
                                        return
                                    } else {
                                        this.props.onSearch(this.state.searchText.trim());
                                    }
                                }
                            }}>
                            <Text style={{marginRight: 10}}>搜索</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        }

        return (
            <View>
                {searchBox}
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    searchBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 6
    },
    TextInput: {
        padding: 1,
        width: width * 0.63,
        color: '#9C9C9C',
        fontSize: 12
    }

});