import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    TouchableOpacity,
    WebView,
    Image
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';

export default class LocationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        };

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

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };

        let navigationBar =
            <NavigationBar
                title={this.props.item.name}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    // source={{uri: 'https://www.baidu.com/index.php?tn=22073068_2_dghttps://www.baidu.com/index.php?tn=22073068_2_dg'}}
                    source={{uri: 'http://localhost:8081/js/html/Location/locationMap.html'}}
                    startInLoadingState={true}/>
            </View>
        )
    }
}

let styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
});