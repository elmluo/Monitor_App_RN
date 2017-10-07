import React from 'react';
import {
    Button,
    Image,
    View,
    Text
} from 'react-native';

class Alarm extends React.Component {
    static navigationOptions = {
        title:'告警页面',
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
export default Alarm;