import React from 'react';
import {
    View,
    Text
} from 'react-native';

class Function extends React.Component {
    static navigationOptions = {
        title:'功能页面',
    };

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={{backgroundColor:'#fff',flex:1}}>
                <Text style={{padding:20}}>告警内容</Text>
            </View>

        );
    }
}
export default Function;