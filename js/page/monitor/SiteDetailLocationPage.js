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
        let insertJSToHtml = `
        obj={a: 120.261498, b: 30.317364};
        var map = new AMap.Map('container',{
            zoom: 10,
            center: [window.obj.a,window.obj.b]
        });`;

        //120.261498,30.317364
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    injectedJavaScript={insertJSToHtml}
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