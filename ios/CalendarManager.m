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

RCT_EXPORT_METHOD(pushVideoVC_stamp:(NSString *)stamp userId:(NSString *)userId httpUrl:(NSString *)url )
{
  RCTLogInfo(@"Pretending to create an event %@ at %@  url %@", stamp, userId,url);

//  [ShareSingle Single].appUrl = @"http://192.168.0.3:8180";
//  [FileCacheManager saveInMyLocalStoreForValue:@"cmcc" atKey:_CompanyStamp];
//  [FileCacheManager saveInMyLocalStoreForValue:@"5a16ae8e0666386bfab53e91"atKey:_UsermId];
  dispatch_async(dispatch_get_main_queue(), ^{
    [ShareSingle Single].appUrl = url;
    [FileCacheManager saveInMyLocalStoreForValue:stamp atKey:_CompanyStamp];
    [FileCacheManager saveInMyLocalStoreForValue:userId atKey:_UsermId];
//    [[NSNotificationCenter defaultCenter]postNotificationName:@"RNOpenOneVC" object:nil];

    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    VideoMontiorVC *video = [[VideoMontiorVC alloc]init];
//    video.hidesBottomBarWhenPushed = YES;
    [app.nav pushViewController:video animated:YES];

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
