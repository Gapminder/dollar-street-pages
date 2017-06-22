import { NgModule } from '@angular/core';

import { LoaderService } from './loader/loader.service';
import { TitleHeaderService } from './title-header/title-header.service';
import { StreetSettingsService } from './street/street-settings.service';
import { StreetSettingsActions } from './street/street-settings.actions';
import { BrowserDetectionService } from './browser-detection/browser-detection.service';
import { LocalStorageService } from './guide/localstorage.service';
import { MathService } from './math/math.service';
import { UrlChangeService } from './url-change/url-change.service';
import { LanguageService } from './language/language.service';
import { ActiveThingService } from './things/active-thing.service';
import { SocialShareService } from './social/social-share.service';
import { FontDetectorService } from './font/font-detector.service';
import { GoogleAnalyticsService } from './analytics/google-analytics.service';
import { CountryDetectorService } from './country-detector/country-detector.service';
import { UtilsService } from './utils/utils.service';

@NgModule({
  imports: [],
  providers: [
    StreetSettingsActions,
    LoaderService,
    TitleHeaderService,
    StreetSettingsService,
    BrowserDetectionService,
    LocalStorageService,
    MathService,
    UrlChangeService,
    LanguageService,
    ActiveThingService,
    SocialShareService,
    FontDetectorService,
    GoogleAnalyticsService,
    CountryDetectorService,
    UtilsService
  ]
})
export class CommonAppModule {
}
