/**
 * ******** 搜索条 ********
 * props
 *   placeholder: 默认显示文字
 *   onClick： 如果传入改属性方法，则搜索框之后样式，可以进行点击事件； 如果不传改方法，则为正常搜索框。
 *
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
        this.state = {
        };
    }


    render() {
        let searchBox;
        if (this.props.onClick) {
            searchBox =
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.props.onClick}>
                    <View style={styles.searchBox}>
                        <View
                            style={{flexDirection: 'row', backgroundColor: '#F3F3F3', width: '100%', alignItems: 'center',height: 28, borderRadius: 2}}>
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
                    <View style={{flexDirection: 'row', backgroundColor: '#F3F3F3', width: '100%', alignItems: 'center', borderRadius: 2}}>
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
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}/>
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
        // borderColor: 'transparent',
        borderColor: 'red',
        padding: 1,
        width: width * 0.7,
        color: '#9C9C9C',
        fontSize: 12
        // height: 28
    }

});