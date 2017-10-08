import React from 'react';
import {
    Button,
    Image,
    View,
    Text
} from 'react-native';

class Home extends React.Component {
    static navigationOptions = {
        title:'首页',
    };

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={{backgroundColor:'#fff',flex:1}}>
                <Text style={{padding:20}}>首页内容</Text>
            </View>

        );
    }
}
export default Home;