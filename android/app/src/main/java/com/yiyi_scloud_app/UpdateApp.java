package com.yiyi_scloud_app;

/**
 * Created by liujun on 2017/11/15.
 */


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.yiyi_scloud_app.MainActivity;
import util.UpdateAppUtils;

/**
 * Created by lj on 2017/5/6.
 */
//对RN调用进行相应
public class UpdateApp extends ReactContextBaseJavaModule {

    private ReactContext reactContext;

    public UpdateApp(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UpdateApp";
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
    //进行更新操作
    @ReactMethod
    public void updateDialog (String versionName,String path){
        System.out.println(path+"URL");
        UpdateAppUtils.from(MainActivity.getMainActivity())//获取原生Activity
                .serverVersionName(versionName)//获取版本号
                .apkPath(path)//获取下载URL
                .update();//更新操作
    }
    //退出应用
    @ReactMethod
    public void updateExite (){
        System.exit(0);

    }

}