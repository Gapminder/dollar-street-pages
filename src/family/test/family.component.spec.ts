import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';

import { MathService, StreetSettingsEffects } from '../../common';
import { FamilyComponent } from '../family.component';
import { FamilyService } from '../family.service';
import { LocalStorageService } from '../../common/local-storage/local-storage.service';

import { BlankComponent } from '../../test/';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { ActivatedRoute } from '@angular/router';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { AppStates } from '../../interfaces';
import { UrlChangeServiceMock } from '../../test/mocks/urlChange.service.mock';
import { UrlChangeService } from '../../common/url-change/url-change.service';

describe('Component: FamilyComponent', () => {
  let fixture: ComponentFixture<FamilyComponent>;
  let component: FamilyComponent;
  let activatedRoute: ActivatedRouteMock;
  let store: Store<AppStates>;
  let storeSpy;
  let urlChangeService: UrlChangeServiceMock;
  let urlChangeServiceSpy;

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

  class ActivatedRouteMock {
    queryParams = Observable.of({
      thing: '',
      countries: '',
      regions: '',
      zoom: 0,
      row: 0,
      lang: '',
      lowIncome: 11111,
      highIncome: 222222
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        CommonServicesTestingModule,
        StoreModule.forRoot({}),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        EffectsModule.forRoot([StreetSettingsEffects]),
        RouterTestingModule.withRoutes([{
          path: 'matrix',
          component: BlankComponent
        }])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BlankComponent, FamilyComponent],
      providers: [
        LocalStorageService,
        MathService,
        {provide: FamilyService, useClass: MockFamilyService},
        {provide: ActivatedRoute, useClass: ActivatedRouteMock},
        {provide: UrlChangeService, useClass: UrlChangeServiceMock}
      ]
    });

    fixture = TestBed.createComponent(FamilyComponent);
    activatedRoute = TestBed.get(ActivatedRoute);

    store = TestBed.get(Store);
    urlChangeService = TestBed.get(UrlChangeService);
    storeSpy = spyOn(store, 'select');
    urlChangeServiceSpy = spyOn(urlChangeService, 'replaceState').and.stub();

    component = fixture.componentInstance;

    component.urlParams = {
      thing: '',
      countries: '',
      regions: '',
      zoom: 0,
      row: 0,
      lang: '',
      lowIncome: 1,
      highIncome: 2,
      place: 'testPlace'
    };
  });


  it('got default values on init', () => {
    fixture.detectChanges();

    expect(component.theWorldTranslate).toEqual('translated');
  });

  it('unsubsribe on destroy', () => {
    fixture.detectChanges();

    spyOn(component.queryParamsSubscribe, 'unsubscribe');
    spyOn(component.familyServiceSetThingSubscribe, 'unsubscribe');
    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.familyServiceSetThingSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('get activeImage from activeRoute params on init', () => {
    activatedRoute.queryParams = Observable.of({
      activeImage: 2,
      thing: '',
      countries: '',
      regions: '',
      zoom: 0,
      row: 0,
      lang: '',
      lowIncome: 11111,
      highIncome: 222222
    });
    fixture.detectChanges();

    expect(component.urlParams.activeImage).toEqual(2);
  });

  it('get poor and rich from store on init', () => {
    const streetSettings = {
      poor: 1,
      rich: 2
    };
    storeSpy.and.returnValue(Observable.of({streetSettings}));

    fixture = TestBed.createComponent(FamilyComponent);
    activatedRoute = TestBed.get(ActivatedRoute);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.poor).toEqual(streetSettings.poor);
      expect(component.rich).toEqual(streetSettings.rich);
    });
  });

  it('change url and set query params on activeImageOptions', () => {
    const options = {
      row: 2,
      activeImageIndex: 3
    };
    const url = 'thing=Families&countries=World&regions=World&zoom=4&row=1&lowIncome=11111&highIncome=222222&place=undefined&lang=undefined';
    const storeDispatchSpy = spyOn(store, 'dispatch').and.stub();

    fixture.detectChanges();

    component.activeImageOptions(options);

    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(urlChangeServiceSpy).toHaveBeenCalledWith('/family', url);
  });
});
