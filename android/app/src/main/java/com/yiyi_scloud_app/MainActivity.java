package com.yiyi_scloud_app;

import android.content.Intent;
import android.os.Bundle;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.reactnativejpush.JPushPackage;
import util.UpdateAppUtils;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactMethod;

public class MainActivity extends ReactActivity {

    public MainActivity() {
        mainActivity = this;
    }
    public static MainActivity getMainActivity() {
        return mainActivity;
    }

    private static MainActivity mainActivity;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "YIYI_Scloud_App";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);

    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }



}
