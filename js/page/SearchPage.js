import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';


import Searchbox from "../common/Searchbox";
export default class ComponentName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[this.state.theme.styles.navBar, styles.header]}>
                    <Searchbox/>
                    <TouchableOpacity
                        onPress={()=> {
                            this.props.navigator.pop();
                        }}>
                        <Text style={{color: '#FFFFFF', fontSize: 14}}>取消</Text>
                    </TouchableOpacity>
                </View>
                <Text>SearchPage页面</Text>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
    }
});