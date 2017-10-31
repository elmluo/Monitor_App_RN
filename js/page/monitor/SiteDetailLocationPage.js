import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Alert,
    TouchableOpacity,
    WebView,
    Image,
    Platform,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import resolveAssetSource from 'resolveAssetSource';

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

    /**
     * 百度经纬度——>高德
     * @param bd_lat
     * @param bd_lon
     * @param gg_lat
     * @param gg_lon
     * @private
     */
    _bd_decrypt(bd_lat, bd_lon) {
        let x_pi = Math.PI * 3000.0 / 180.0;

        let x = bd_lon - 0.0065,
            y = bd_lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let gg_lon = z * Math.cos(theta);
        let gg_lat = z * Math.sin(theta);
        return {gg_lon:gg_lon,gg_lat:gg_lat}
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };

        let navigationBar =
            <NavigationBar
                title={'地图功能'}
                statusBar={statusBar}
                style={this.state.theme.styles.navBar}
                leftButton={this._renderLeftButton()}/>;
        let insertJSToHtml = `
            obj={a: 120.261498, b: 30.317364};
            var map = new AMap.Map('container',{
                zoom: 10,
                center: [window.obj.a,window.obj.b]
            });
            map.plugin(["AMap.Scale"],function(){
            var scale = new AMap.Scale();
            map.addControl(scale);
        });`;


        // 静态html需要分别放到android的android\app\src\main\assets\locationMap.html
        // ios 放到自己建的文件夾中。
        // let source;
        // const _source = resolveAssetSource(require('../../html/Location/locationMap.html'));
        // if (__DEV__) {
        //     source = {uri: `${_source.uri}`};
        // } else {
        //     const sourceAndroid = {uri: `file:///android_asset/locationMap.html`};
        //     const sourceIOS = {uri: `file://${_source.uri}`};
        //     source = Platform.OS === 'ios' ? sourceIOS : sourceAndroid;
        // }

        // alert(JSON.stringify(source));

        let gg=this._bd_decrypt(this.props.item.latitude, this.props.item.longitude);
        console.log(gg);
        let gg_lon = gg.gg_lon;
        let gg_lat = gg.gg_lat;

        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    // injectedJavaScript={insertJSToHtml}
                    source={{
                        uri: `https://uri.amap.com/marker?position=${gg_lon},${gg_lat}&name=${this.props.item.name}&src=mypage&coordinate=gaode&callnative=0 `
                    }}
                    // source={source}
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