import { NgModule } from '@angular/core';

import { LoaderService } from './loader/loader.service';
import { TitleHeaderService } from './title-header/title-header.service';
import { StreetSettingsService } from './street/street-settings.service';
import { BrowserDetectionService } from './browser-detection/browser-detection.service';
import { LocalStorageService } from './guide/localstorage.service';
import { MathService } from './math/math.service';
import { UrlChangeService } from './url-change/url-change.service';
import { LanguageService } from './language/language.service';
import { SocialShareService } from './social/social-share.service';
import { FontDetectorService } from './font/font-detector.service';
import { GoogleAnalyticsService } from './analytics/google-analytics.service';
import { CountryDetectorService } from './country-detector/country-detector.service';
import { UtilsService } from './utils/utils.service';
import { ImageGeneratorService } from './image-generator/image-generator.service';
import { SortPlacesService } from './sort-places/sort-places.service';
import { IncomeCalcService } from './income-calc/income-calc.service';

@NgModule({
  imports: [],
  providers: [
    LoaderService,
    TitleHeaderService,
    StreetSettingsService,
    BrowserDetectionService,
    LocalStorageService,
    MathService,
    UrlChangeService,
    LanguageService,
    SocialShareService,
    FontDetectorService,
    GoogleAnalyticsService,
    CountryDetectorService,
    UtilsService,
    ImageGeneratorService,
    SortPlacesService,
    IncomeCalcService
  ]
})
export class CommonAppModule {
}
