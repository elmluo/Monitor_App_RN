let instance = null;
export default class LocalStorageClass {
    searchHistoryArr = [];

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    // 操作用户登录
    setLoginInfo(data) {
        this.loginInfo = data;
    }

    getLoginInfo() {
        return this.loginInfo;
    }

    // 操作搜索历史记录数组
    addSearchHistory(item) {
        this.searchHistoryArr.push(item)
    }

    deleteSearchHistory(item) {
        this.searchHistoryArr.splice(this.searchHistoryArr.indexOf(item), 1);
    }

    deleteAllSearchHistory() {
        this.searchHistoryArr = [];
    }

    getAllSearchHistory() {
        return this.searchHistoryArr
    }
}
