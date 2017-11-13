//
//  CalendarManager.m
//  YIYI_Scloud_App
//
//  Created by  LJ on 2017/11/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CalendarManager.h"
#import "AppDelegate.h"


@interface CalendarManager()
@end
@implementation CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
RCT_EXPORT_METHOD(upDate)
{
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"itms-apps://itunes.apple.com/app/id1142914889"]];
}
RCT_EXPORT_METHOD(exitApplication)
{
  AppDelegate *app =[UIApplication sharedApplication].delegate;
  UIWindow *window = app.window;
  [UIView animateWithDuration:1.0f animations:^{
    window.alpha = 0;
    window.frame = CGRectMake(0, window.bounds.size.width, 0, 0);
  } completion:^(BOOL finished) {
    exit(0);
  }];
  
}
@end
