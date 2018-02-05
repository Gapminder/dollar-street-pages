import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateLoader, TranslateModule } from 'ng2-translate';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';

import {
  BrowserDetectionService,
  IncomeCalcService,
  LanguageService,
  LoaderService,
  LocalStorageService,
  MathService,
  StreetSettingsService,
  TitleHeaderService,
  UrlChangeService,
  UtilsService
} from '../common';
import * as mocks from './index';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({ TEST: 'This is a test' });
  }
}

@NgModule({
  imports: [
    TranslateModule.forRoot(
      { provide: TranslateLoader, useClass: FakeLoader }
    )
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: Angulartics2, useClass: mocks.AngularticsMock },
    { provide: BrowserDetectionService, useClass: mocks.BrowserDetectionServiceMock },
    { provide: UrlChangeService, useClass: mocks.UrlChangeServiceMock },
    { provide: UtilsService, useClass: mocks.UtilsServiceMock },
    { provide: LoaderService, useClass: mocks.LoaderServiceMock },
    { provide: StreetSettingsService, useClass: mocks.StreetSettingsServiceMock },
    { provide: Angulartics2GoogleAnalytics, useClass: mocks.AngularticsMock },
    { provide: LanguageService, useClass: mocks.LanguageServiceMock },
    { provide: TitleHeaderService, useClass: mocks.TitleHeaderServiceMock },
    { provide: IncomeCalcService, useClass: mocks.IncomeCalcServiceMock },
    { provide: MathService, useClass: mocks.MathServiceMock },
    { provide: LocalStorageService, useClass: mocks.LocalStorageServiceMock },
  ]
})
export class CommonServicesTestingModule {
}
