import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal
} from 'react-native';
const { width, height } = Dimensions.get('window')
import loadingImage from '../../res/Image/BaseIcon/doctor.gif'
class LoadingView extends Component{
    constructor(props) {
        super(props);
    }
    _close(){
        console.log("onRequestClose ---- ")
    }
    render() {
        const { showLoading, opacity, backgroundColor } = this.props
        return (
            <Modal onRequestClose={() => this._close()} visible={showLoading} transparent>
                <View style={ [styles.loadingView, {opacity: opacity||0, backgroundColor: backgroundColor||'white'}]}></View>
                <View style={ styles.loadingImageView }>
                    <View style={ styles.loadingImage }>
                        {
                            this.props.closeLoading ?
                                <TouchableOpacity onPress={ this.props.closeLoading }>
                                    <Image style={ styles.loadingImage } source={ loadingImage }/>
                                </TouchableOpacity>
                                :
                                <Image style={ styles.loadingImage } source={ loadingImage }/>
                        }
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute'
    },
    loadingImage: {
        width: 70,
        height: 70,
        backgroundColor:'rgba(0,0,0,0)'
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
LoadingView.propTypes = {
    closeLoading: React.PropTypes.func, //.isRequired,
    showLoading: React.PropTypes.bool.isRequired,
    opacity: React.PropTypes.number,
    backgroundColor: React.PropTypes.string
}

export default LoadingView