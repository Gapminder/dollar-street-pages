import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';

import { LanguageService } from '../common/language/language.service';
import { StreetSettingsService } from '../common/street-settings/street-settings.service';
import { LoaderService } from '../common/loader/loader.service';
import { UtilsService } from '../common/utils/utils.service';
import { UrlChangeService } from '../common/url-change/url-change.service';
import { BrowserDetectionService } from '../common/browser-detection/browser-detection.service';

import { IncomeCalcService } from '../common/income-calc/income-calc.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';
import { BrowserDetectionServiceMock } from './mocks/browserDetection.service.mock';
import { UtilsServiceMock } from './mocks/utils.service.mock';
import { UrlChangeServiceMock } from './mocks/urlChange.service.mock';
import { LoaderServiceMock } from './mocks/loader.service.mock';
import { StreetSettingsServiceMock } from './mocks/streetSettings.service.mock';
import { LanguageServiceMock } from './mocks/language.service.mock';
import { TitleHeaderServiceMock } from './mocks/titleHeader.service.mock';
import { AngularticsMock } from './mocks/angulartics.mock';
import { MathService } from '../common/math/math.service';
import { MathServiceMock } from './mocks/math.service.mock';
import { IncomeCalcServiceMock } from './mocks/incomeCalc.service.mock';
import { LocalStorageServiceMock } from './mocks/localStorage.service.mock';
import { LocalStorageService } from '../common/index';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: () => new TranslateStaticLoader(null, './assets/i18n', '.json')
    })
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: Angulartics2, useClass: AngularticsMock },
    { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
    { provide: UrlChangeService, useClass: UrlChangeServiceMock },
    { provide: UtilsService, useClass: UtilsServiceMock },
    { provide: LoaderService, useClass: LoaderServiceMock },
    { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
    { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
    { provide: LanguageService, useClass: LanguageServiceMock },
    { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
    { provide: IncomeCalcService, useClass: IncomeCalcServiceMock },
    { provide: MathService, useClass: MathServiceMock },
    { provide: LocalStorageService, useClass: LocalStorageServiceMock },
  ]
})
export class CommonServicesTestingModule {
}
