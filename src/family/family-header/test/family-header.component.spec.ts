import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FamilyHeaderComponent } from '../family-header.component';
import { FamilyHeaderService } from '../family-header.service';
import * as MatrixActions from '../../../matrix/ngrx/matrix.actions';
import * as StreetSettingsActions from '../../../common/street-settings/ngrx/street-settings.actions';
import * as fromRoot from '../../../app/ngrx/root.reducer';
import { AppStates, Currency, DrawDividersInterface, TimeUnit } from '../../../interfaces';

import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { IncomeCalcService } from '../../../common/income-calc/income-calc.service';
import { IncomeCalcServiceMock } from '../../../test/mocks/incomeCalc.service.mock';
import { UtilsService } from '../../../common/utils/utils.service';
import { UtilsServiceMock } from '../../../test/mocks/utils.service.mock';
import { LanguageService } from '../../../common/language/language.service';
import { LanguageServiceMock } from '../../../test/mocks/language.service.mock';

describe('FamilyHeaderComponent', () => {
  let fixture: ComponentFixture<FamilyHeaderComponent>;
  let component: FamilyHeaderComponent;
  let store: Store<AppStates>;
  let incomeCalcService: IncomeCalcServiceMock;
  let familyHeaderService: FamilyHeaderServiceMock;
  let utilsService: UtilsServiceMock;
  let languageService: LanguageServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        Angulartics2Module.forRoot([]),
        StoreModule.forRoot({ ...fromRoot.reducers }),
        RouterTestingModule,
        CommonServicesTestingModule
      ],
      declarations: [
        FamilyHeaderComponent,
        TranslateMeComponentMock,
        RegionMapComponentMock
      ],
      providers: [
        { provide: FamilyHeaderService, useClass: FamilyHeaderServiceMock }
      ]
    });

    incomeCalcService = TestBed.get(IncomeCalcService);
    familyHeaderService = TestBed.get(FamilyHeaderService);
    utilsService = TestBed.get(UtilsService);
    languageService = TestBed.get(LanguageService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(incomeCalcService, 'getCurrencyUnitByCode').and.returnValue(currencyUnit);
    spyOn(incomeCalcService, 'calcPlaceIncome').and.returnValue(currencyUnit);

    fixture = TestBed.createComponent(FamilyHeaderComponent);

    component = fixture.componentInstance;
  });

  it('subscriptions on init', () => {
    fixture.detectChanges();
    expect(component.getTranslationSubscribe).toBeDefined();
    expect(component.familyHeaderServiceSubscribe).toBeDefined();
    expect(component.queryParamsSubscribe).toBeDefined();
    expect(component.streetSettingsStateSubscription).toBeDefined();
    expect(component.matrixStateSubscription).toBeDefined();
    expect(component.resizeSubscribe).toBeDefined();
  });

  it('ngOnDestroy()', () => {
    fixture.detectChanges();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');
    spyOn(component.familyHeaderServiceSubscribe, 'unsubscribe');
    spyOn(component.queryParamsSubscribe, 'unsubscribe');
    spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
    spyOn(component.matrixStateSubscription, 'unsubscribe');
    spyOn(component.resizeSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.familyHeaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.matrixStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('get currencyUnit from store on init', () => {
    store.dispatch(new MatrixActions.SetCurrencyUnit(currencyUnit));

    fixture.detectChanges();

    expect(component.currencyUnit).toEqual(currencyUnit);
  });

  it('home and mapData not defined when FamilyHeaderService responds with error', () => {
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: true, data: '' }));

    fixture.detectChanges();

    expect(component.home).toEqual({});
    expect(component.mapData).not.toBeDefined();
  });

  it('show translateMe label when no translation to user`s language', () => {
    component.home.translated = false;
    languageService.currentLanguage = 'ru'
    languageService.defaultLanguage = 'en'
    expect(component.showTranslateMe).not.toBeDefined();

    fixture.detectChanges();

    expect(component.showTranslateMe).toBe(true);
  });

  it('do not show translateMe label when home is translated', () => {
    expect(component.showTranslateMe).not.toBeDefined();

    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United States'
      },
      aboutData: expectedAboutData,
      translated: true
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    fixture.detectChanges();

    expect(component.showTranslateMe).not.toBeDefined();
  });

  it('get timeUnits from store on init', () => {
    const expectedTimeUnits = [{
      code: 'DAY',
      name: 'Day',
      name1: 'Daily income',
      per: 'day'
    }];
    const action = new MatrixActions.GetTimeUnitsSuccess(expectedTimeUnits);

    expect(component.timeUnits).not.toBeDefined();

    store.dispatch(action);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(component.timeUnits).toEqual(expectedTimeUnits);
  });

  it('call timeUnits when there is no in store', () => {
    const action = new MatrixActions.GetTimeUnits();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('call currencyUnits from store on init', () => {
    const action = new MatrixActions.GetCurrencyUnits();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('when currencyUnits in store - get currency unit', () => {
    const action = new MatrixActions.GetCurrencyUnitsSuccess([currencyUnit]);

    store.dispatch(action);

    fixture.detectChanges();

    expect(component.currencyUnits).toEqual([currencyUnit]);
    expect(component.currencyUnit).toEqual(currencyUnit);
    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(incomeCalcService.getCurrencyUnitByCode).toHaveBeenCalled();
  });

  it('get street settings from store', () => {
    store.dispatch(new StreetSettingsActions.GetStreetSettingsSuccess(defaultStreetSettings));

    fixture.detectChanges();

    expect(component.streetData).toEqual(defaultStreetSettings);
  });

  it('calcIncomeValue when timeUnit, currencyUnit and home are defined', () => {
    fixture.detectChanges();
    const currencyUnitAction = new MatrixActions.GetCurrencyUnitsSuccess([currencyUnit]);
    store.dispatch(currencyUnitAction);

    const timeUnitAction = new MatrixActions.SetTimeUnit(defaultTimeUnit);
    store.dispatch(timeUnitAction);

    expect(incomeCalcService.calcPlaceIncome).toHaveBeenCalled();
    expect(component.familyIncome).toBeDefined();
  });

  it('show about popup on click on icon', () => {
    fixture.detectChanges();
    const de = fixture.debugElement;
    const aboutIcon = de.query(By.css('.short-about-info-image')).nativeElement;
    aboutIcon.click();
    fixture.detectChanges();

    const aboutDataPopup = de.query(By.css('.about-data-container')).nativeElement;

    expect(aboutDataPopup.getAttribute('class')).toContain('open');
  });

  it('show about popup on hover on icon', () => {
    spyOn(utilsService, 'getCoordinates').and.stub();

    fixture.detectChanges();
    const de = fixture.debugElement;
    const aboutIcon = de.query(By.css('.short-about-info-image')).nativeElement;
    aboutIcon.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const aboutDataPopupContent = de.query(By.css('.about-data-content')).nativeElement;

    expect(aboutDataPopupContent.textContent).toContain(expectedAboutData);
    expect(utilsService.getCoordinates).toHaveBeenCalled();
  });

  it('close about popup on click', () => {
    fixture.detectChanges();
    const de = fixture.debugElement;
    const aboutIcon = de.query(By.css('.short-about-info-image')).nativeElement;
    aboutIcon.click();
    fixture.detectChanges();

    const closeBtn = de.query(By.css('.closeMenu')).nativeElement;
    closeBtn.click();

    fixture.detectChanges();
    const aboutDataPopup = de.query(By.css('.about-data-container')).nativeElement;

    expect(aboutDataPopup.getAttribute('class')).not.toContain('open');
  });

  it('truncCountryName(): convert "United Kingdom" to "UK"', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United Kingdom'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    expect(component.countryName).not.toBeDefined();

    fixture.detectChanges();

    expect(familyHeaderService.getFamilyHeaderData).toHaveBeenCalled();
    expect(component.countryName).toEqual('UK');
  });

  it('truncCountryName(): convert "United States" to "USA"', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United States'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    expect(component.countryName).not.toBeDefined();

    fixture.detectChanges();

    expect(familyHeaderService.getFamilyHeaderData).toHaveBeenCalled();
    expect(component.countryName).toEqual('USA');
  });

  it('truncCountryName(): convert "South Africa" to "SA"', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'South Africa'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    expect(component.countryName).not.toBeDefined();

    fixture.detectChanges();

    expect(familyHeaderService.getFamilyHeaderData).toHaveBeenCalled();
    expect(component.countryName).toEqual('SA');
  });

  it('truncCountryName(): trim name if it`s more then 10 chars', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'Papua New Guinea'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    expect(component.countryName).not.toBeDefined();

    fixture.detectChanges();

    expect(familyHeaderService.getFamilyHeaderData).toHaveBeenCalled();
    expect(component.countryName).toEqual('Papua Ne...');
  });

  it('truncCountryName(): leave name as it is when it`s less then 10 chars', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'Ukraine'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    expect(component.countryName).not.toBeDefined();

    fixture.detectChanges();

    expect(familyHeaderService.getFamilyHeaderData).toHaveBeenCalled();
    expect(component.countryName).toEqual('Ukraine');
  });

  it('open expand block for home description', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United States'
      },
      aboutData: expectedAboutData,
      familyThingId: '1',
      image: '//fakepath'
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));
    
    fixture.detectChanges();
    const shortFamilyInfoBtn = fixture.debugElement.query(By.css('.home-description-container .image-container > img'));
    let expectedEvent;
    component.familyExpandBlock.subscribe((event) => expectedEvent = event);

    shortFamilyInfoBtn.triggerEventHandler('click', null);

    expect(expectedEvent).toEqual({thingId: '1'});
  });

  it('open info', () => {
    expect(component.isOpenArticle).not.toBeDefined();

    fixture.detectChanges();
    const showInfoBtn = fixture.debugElement.query(By.css('.show-info > span'));

    showInfoBtn.triggerEventHandler('click', null);

    expect(component.isOpenArticle).toBe(true);
  });

  it('emit output with streetFamilyData', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'Ukraine'
      },
      aboutData: expectedAboutData
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));

    let expectedEvent;
    component.streetFamilyData.subscribe(event => expectedEvent = event);
    
    fixture.detectChanges();

    expect(expectedEvent).toEqual({income: 1, region: 'World'});
  });

  it('open expand block for short-family-info', () => {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United States'
      },
      aboutData: expectedAboutData,
      familyThingId: '1',
      image: '//fakepath'
    };
    spyOn(familyHeaderService, 'getFamilyHeaderData').and.returnValue(Observable.of({ err: null, data }));
    
    fixture.detectChanges();
    const shortFamilyInfoBtn = fixture.debugElement.query(By.css('.short-family-info-container .image-container > img'));
    let expectedEvent;
    component.familyExpandBlock.subscribe((event) => expectedEvent = event);

    shortFamilyInfoBtn.triggerEventHandler('click', null);

    expect(expectedEvent).toEqual({thingId: '1'});
  });
});


// Mocks and default values
@Component({
  selector: 'region-map',
  template: ''
})
class RegionMapComponentMock {
  @Input()
  public mapData;
}

@Component({
  selector: 'translate-me',
  template: ''
})
class TranslateMeComponentMock {
}

const expectedAboutData = 'test about data';

class FamilyHeaderServiceMock {
  getFamilyHeaderData(query: string): Observable<any> {
    const data = {
      income: 1,
      country: {
        region: 'World',
        alias: 'United States'
      },
      aboutData: expectedAboutData
    };

    return Observable.of({ err: null, data });
  }
}

const currencyUnit: Currency = {
  currency: 'string',
  code: 'string',
  value: 1,
  symbol: 'string',
  updated: 1,
  translations: [{}]
};

const defaultTimeUnit: TimeUnit = {
  code: 'code',
  name: 'name',
  per: 'per'
};

const defaultStreetSettings: DrawDividersInterface = {
  showDividers: true,
  low: 1,
  medium: 2,
  high: 3,
  poor: 4,
  rich: 5,
  lowDividerCoord: 5,
  mediumDividerCoord: 6,
  highDividerCoord: 7
};
