import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import Btn from '../my/BaseBtn'

let {width,height} = Dimensions.get('window')
export default class SetUpServer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            btnText:'确定'
        };

    }
    //返回按钮
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
    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar =
            <NavigationBar
                title={'设置服务器地址'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}
            />;
        return (

            //设置服务器地址
            <View style={styles.container}>
                {navigationBar}

                <View style = {{marginTop:49}}>
                    <View style = {styles.textInputViewStyle}>
                        <TextInput
                            ref="inputLoginName"
                            // autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholderTextColor = '#7E7E7E'
                            placeholder="请输入服务器地址"
                            clearTextOnFocus={true}
                            clearButtonMode="while-editing"
                            style={styles.textInputSize}
                            onChangeText={(input) => this.setState({username: input})}>
                        </TextInput>
                    </View>

                </View>

                <View style = {{marginTop:60,width:width,height:50,backgroundColor:'#FFF'}}>


                    <TouchableOpacity onPress={() => {
                        this.props.navigator.pop();
                    }}>
                        <Btn text = {this.state.btnText} />
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFF'
    },
    textInputViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:30,
        marginRight:30,
        borderBottomWidth:1,
        borderBottomColor:'rgb(235,235,235)'

    },
    textInputSize:{
        marginTop:20,
        height:50,
        width:width-60,
        textAlign:'left',

    }
});