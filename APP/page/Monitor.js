import React from 'react';
import {
    View,
    Text
} from 'react-native';

class Monitor extends React.Component {
    static navigationOptions = {
        title:'监控页面',
    };

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={{backgroundColor:'#fff',flex:1}}>
                <Text style={{padding:20}}>这里是监控内容</Text>
            </View>

        );
    }
}
export default Monitor;