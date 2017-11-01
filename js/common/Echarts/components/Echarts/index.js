import React, { Component } from 'react';
import { WebView, View, StyleSheet } from 'react-native';
import renderChart from './renderChart';
import merge from 'merge';
import resolveAssetSource from 'resolveAssetSource';

export default class App extends Component {
  componentWillReceiveProps(nextProps) {    
    if(JSON.stringify(nextProps.option) !== JSON.stringify(this.props.option)) {
      this.refs.chart.reload();
    }
  }

  render() {

    let source;
    const _source = resolveAssetSource(require('./tpl.html'));
    if (__DEV__) {
      source = { uri: `${_source.uri}` };
    } else {
      const sourceAndroid = { uri: `file:///android_asset/tpl.html` };
      const sourceIOS = { uri: `file://${_source.uri}` };
      source = Platform.OS === 'ios' ? sourceIOS : sourceAndroid;
    }

    // alert(JSON.stringify(source));
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          style={ merge(this.props.style || {}, {
            height: this.props.height || 400
          })}
          source={source}
        />
      </View>
    );
  }
}
