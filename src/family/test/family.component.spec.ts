import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import { Angulartics2Module, Angulartics2 } from 'angulartics2';

import { FamilyModule } from '../family.module';
import {
  UrlChangeService,
  LanguageService,
  LocalStorageService,
  BrowserDetectionService,
  MathService,
  LoaderService,
  Angulartics2GoogleAnalytics,
  StreetSettingsService,
  StreetSettingsEffects,
  UtilsService
} from '../../common';
import { FamilyComponent } from '../family.component';
import { FamilyService } from '../family.service';
import { IncomeCalcService } from '../../common/income-calc/income-calc.service';

import {
  LoaderServiceMock,
  LanguageServiceMock,
  StreetSettingsServiceMock,
  AngularticsMock,
  BlankComponent,
  BrowserDetectionServiceMock,
  UtilsServiceMock,
  UrlChangeServiceMock,
  TranslateServiceMock,
  TranslateLoaderMock,
  TranslateParserMock
} from '../../test/';

describe('FamilyComponent', () => {
  let fixture: ComponentFixture<FamilyComponent>;
  let component: FamilyComponent;

  class MockFamilyService {
    public getThing(): Observable<any> {
      let response: any = {
        success: true,
        data: {
          _id: '546ccf730f7ddf45c017962f',
          thingName: 'Family',
          plural: 'Familias',
          originPlural: 'Families',
          originThingName: 'Family'
        },
        error: undefined
      };

      return Observable.of(response);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FamilyModule,
        TranslateModule,
        Angulartics2Module,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([StreetSettingsEffects]),
        RouterTestingModule
      ],
      declarations: [BlankComponent],
      providers: [
        LocalStorageService,
        MathService,
        {provide: TranslateService, useClass: TranslateServiceMock},
        {provide: TranslateLoader, useClass: TranslateLoaderMock},
        {provide: TranslateParser, useClass: TranslateParserMock},
        {provide: Angulartics2, useClass: AngularticsMock},
        {provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock},
        {provide: UrlChangeService, useClass: UrlChangeServiceMock},
        {provide: UtilsService, useClass: UtilsServiceMock},
        {provide: LoaderService, useClass: LoaderServiceMock},
        {provide: StreetSettingsService, useClass: StreetSettingsServiceMock},
        {provide: FamilyService, useClass: MockFamilyService},
        {provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: IncomeCalcService, useValue: {}}
      ]
    });

    fixture = TestBed.createComponent(FamilyComponent);
    component = fixture.componentInstance;

    component.streetSettings = {
      _id: '57963211cc4aaed63a02504c',
      poor: 26,
      rich: 15000,
      lowIncome: 26
    };

    component.urlParams = {
      lowIncome: 26,
      highIncome: 15000
    };
  }));

  it('ngOnInit() ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.streetSettings._id).toEqual('57963211cc4aaed63a02504c');
    expect(component.streetSettings.poor).toEqual(26);
    expect(component.streetSettings.rich).toEqual(15000);

    expect(component.theWorldTranslate).toEqual('translated');

    spyOn(component.queryParamsSubscribe, 'unsubscribe');
    spyOn(component.familyServiceSetThingSubscribe, 'unsubscribe');
    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.familyServiceSetThingSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
