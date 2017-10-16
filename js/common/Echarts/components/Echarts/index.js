import React, { Component } from 'react';
import { WebView, View, StyleSheet } from 'react-native';
import renderChart from './renderChart';
import merge from 'merge';

// import echarts from './echarts.min';

export default class App extends Component {
  componentWillReceiveProps(nextProps) {    
    if(JSON.stringify(nextProps.option) !== JSON.stringify(this.props.option)) {
      this.refs.chart.reload();
    console.log(nextProps)
    }
  }

  render() {
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          style={ merge(this.props.style || {}, {
            height: this.props.height || 400
          })}
          source={require('./tpl.html')}
        />
      </View>
    );
  }
}
