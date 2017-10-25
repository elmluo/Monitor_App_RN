import React, {
    NetInfo
} from 'react-native';

const NOT_NETWORK = "网络不可用，请稍后再试";
const TAG_NETWORK_CHANGE = "NetworkChange";

/***
 * 检查网络链接状态
 * @param callback
 */
const checkNetworkState = (callback) => {
    NetInfo.getConnectionInfo().done((isConnected) => {
        callback(isConnected);
    });
};

/***
 * 添加网络状态变化监听
 * @param tag
 * @param handler
 */
const addEventListener = (tag, handler) => {
    NetInfo.addEventListener(tag, handler);
};


/***
 * 移除网络状态变化监听
 * @param tag 如'change'
 * @param handler
 */
const removeEventListener = (tag, handler) => {
    NetInfo.removeEventListener(tag, handler);
};


export default {
    checkNetworkState,
    addEventListener,
    removeEventListener,
    NOT_NETWORK,
    TAG_NETWORK_CHANGE
}