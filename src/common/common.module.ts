import { NgModule } from '@angular/core';

import { LoaderService } from './loader/loader.service';
import { TitleHeaderService } from './title-header/title-header.service';
import { StreetSettingsService } from './street/street.settings.service';
import { BrowserDetectionService } from './browser-detection/browser-detection.service';
import { LocalStorageService } from './guide/localstorage.service';
import { MathService } from './math/math.service';
import { UrlChangeService } from './url-change/url-change.service';
import { CountriesFilterService } from './countries-filter/countries-filter.service';

import { LanguageService } from './language/language.service';

import { ActiveThingService } from './things/active-thing.service';

@NgModule({
  providers: [
    LoaderService,
    TitleHeaderService,
    StreetSettingsService,
    BrowserDetectionService,
    LocalStorageService,
    MathService,
    UrlChangeService,
    CountriesFilterService,
    LanguageService,
    ActiveThingService
  ]
})
export class CommonAppModule {
}
