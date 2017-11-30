//
//  CalendarManager.m
//  YIYI_Scloud_App
//
//  Created by  LJ on 2017/11/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CalendarManager.h"
#import "AppDelegate.h"
#import "VideoMontiorVC.h"
#import "FileCacheManager.h"
#import "ShareSingle.h"

@interface CalendarManager()
@end
@implementation CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(setData_stamp:(NSString *)stamp userId:(NSString *)userId httpUrl:(NSString *)url )
{
  RCTLogInfo(@"Pretending to create an event %@ at %@  url %@", stamp, userId,url);

//  [ShareSingle Single].appUrl = @"http://192.168.0.3:8180";
//  [FileCacheManager saveInMyLocalStoreForValue:@"cmcc" atKey:_CompanyStamp];
//  [FileCacheManager saveInMyLocalStoreForValue:@"5a16ae8e0666386bfab53e91"atKey:_UsermId];
  dispatch_async(dispatch_get_main_queue(), ^{
    [ShareSingle Single].appUrl = url;
    [FileCacheManager saveInMyLocalStoreForValue:stamp atKey:_CompanyStamp];
    [FileCacheManager saveInMyLocalStoreForValue:userId atKey:_UsermId];
  });
 
}
RCT_EXPORT_METHOD(pushVideoVC_Play:(NSString *)Play)
{
  
  //  [ShareSingle Single].appUrl = @"http://192.168.0.3:8180";
  //  [FileCacheManager saveInMyLocalStoreForValue:@"cmcc" atKey:_CompanyStamp];
  //  [FileCacheManager saveInMyLocalStoreForValue:@"5a16ae8e0666386bfab53e91"atKey:_UsermId];
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    VideoMontiorVC *video = [[VideoMontiorVC alloc]init];
    if ([Play isEqualToString:@"播放"]) {
      video.isBen = Play;
    }
    [app.nav pushViewController:video animated:YES];
    
  });
  
}
RCT_EXPORT_METHOD(setSiteArr:(NSArray *)siteArr deviceArr:(NSArray *)deviceArr )
{
  RCTLogInfo(@"siteArrs %@  deviceArrs %@", siteArr, deviceArr);

  dispatch_async(dispatch_get_main_queue(), ^{

  [ShareSingle Single].VideoDeviceId = deviceArr[1];
  
  [ShareSingle Single].VideoSiteName = [NSString stringWithFormat:@"%@-%@",siteArr[0],deviceArr[0]];
  [ShareSingle Single].VideoSiteId = siteArr[1];
  [ShareSingle Single].VideoSiteMutDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:siteArr[0],siteArr[1], nil];
  [ShareSingle Single].VideoDeviceMutDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:deviceArr[0],deviceArr[1], nil];
    
  });
}

RCT_EXPORT_METHOD(upDate)
{
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"itms-apps://itunes.apple.com/app/id1142914889"]];
}
RCT_EXPORT_METHOD(exitApplication)
{
  AppDelegate *app =(AppDelegate*)[UIApplication sharedApplication].delegate;
  UIWindow *window = app.window;
  [UIView animateWithDuration:1.0f animations:^{
    window.alpha = 0;
    window.frame = CGRectMake(0, window.bounds.size.width, 0, 0);
  } completion:^(BOOL finished) {
    exit(0);
  }];
  
}
@end
