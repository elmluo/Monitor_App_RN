let instance = null;
let  loginInfo= {};
export default class LocalStorageClass {

    constructor() {
        if(!instance){
            instance = this;
        }
        return instance;
    }

    setLoginInfo(data){
        this.loginInfo = data;
    }

    getLoginInfo(){
        return this.loginInfo;
    }
}
