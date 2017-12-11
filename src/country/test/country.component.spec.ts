import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2, Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from 'ng2-translate';
import { StoreModule } from '@ngrx/store';
import { BrowserDetectionService, LanguageService, LoaderService, MathService, TitleHeaderService } from '../../common';
import {
  Angulartics2GoogleAnalyticsMock,
  AngularticsMock,
  BrowserDetectionServiceMock,
  LanguageServiceMock,
  LoaderServiceMock,
  TitleHeaderServiceMock,
  TranslateLoaderMock,
  TranslateParserMock,
  TranslateServiceMock
} from '../../test/';
import { CountryComponent } from '../country.component';
import { CountryInfoComponent } from '../country-info/country-info.component';
import { CountryInfoService } from '../country-info/country-info.service';
import { CountryPlacesComponent } from '../country-places/country-places.component';
import { CountryPlacesService } from '../country-places/country-places.service';
import { RegionMapComponent } from '../../shared/region-map/region-map.component';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';

describe('CountryComponent', () => {
  let fixture: ComponentFixture<CountryComponent>;
  let component: CountryComponent;

  class CountryPlacesServiceMock {
  }

  class CountryInfoServiceMock {
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        TranslateTestingModule,
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      declarations: [
        CountryComponent,
        CountryInfoComponent,
        CountryPlacesComponent,
        RegionMapComponent
      ],
      providers: [
        MathService,
        {provide: CountryInfoService, useClass: CountryInfoServiceMock},
        {provide: CountryPlacesService, useClass: CountryPlacesService},
        {provide: TitleHeaderService, useClass: TitleHeaderServiceMock},
        {provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock},
        {provide: LoaderService, useClass: LoaderServiceMock},
        {provide: Angulartics2, useClass: AngularticsMock}
      ]
    });

    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.queryParamsSubscribe).toBeDefined();

    spyOn(component.queryParamsSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
