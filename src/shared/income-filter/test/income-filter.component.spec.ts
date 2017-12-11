import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { TranslateStaticLoader } from 'ng2-translate';

import { MathService } from '../../../common';
import { StreetFilterDrawService } from '../../street-filter/street-filter.service';
import { IncomeFilterComponent } from '../income-filter.component';
import { TranslateTestingModule } from '../../../test/translateTesting.module';

describe('Component. IncomeFilterComponent', () => {
  let fixture: ComponentFixture<IncomeFilterComponent>;
  let component: IncomeFilterComponent;
  let store: StoreMock;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        IncomeFilterComponent
      ],
      providers: [
        MathService,
        {provide: StreetFilterDrawService, useValue: {}},
        {provide: Store, useClass: StoreMock}
      ]
    });

    fixture = TestBed.createComponent(IncomeFilterComponent);
    store = TestBed.get(Store);

    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.debugElement;
  });

  it('streetSettingsStateSubscription is defined', () => {
    expect(component.streetSettingsStateSubscription).toBeDefined();
  });

  it('unsubscribe from streetSettingsStateSubscription on destroy', () => {
    spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('applyFilter update range settings and close the range', () => {
    const expectedRange: any = {
      lowIncome: 1,
      highIncome: 2
    };
    let selectedRange;
    const okBtn = element.query(By.css('.ok-button')).nativeElement;
    component.sendResponse.subscribe(range => selectedRange = range);
    spyOn(component, 'applyFilter').and.callThrough();

    component.getFilter(Object.assign({}, expectedRange));
    expectedRange.close = true;

    okBtn.click();

    expect(component.applyFilter).toHaveBeenCalled();
    expect(selectedRange).toEqual(expectedRange);
  });

  it('showAllRange restore default street range settings', () => {
    const showAllBtn = element.query(By.css('.show-all')).nativeElement;
    const expectedRange = {
      lowIncome: defaultStreetSettings.lowIncome,
      highIncome: defaultStreetSettings.highIncome,
      close: true
    };
    let selectedRange;
    component.sendResponse.subscribe(range => selectedRange = range);
    spyOn(store, 'dispatch');

    showAllBtn.click();

    expect(selectedRange).toEqual(expectedRange);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('closeFilter close the filter', () => {
    const closeBtn = element.query(By.css('.close-button')).nativeElement;
    const expectedResponse = {
      close: true
    };
    let actualResponse;
    component.sendResponse.subscribe(response => actualResponse = response);
    spyOn(store, 'dispatch');

    closeBtn.click();

    expect(actualResponse).toEqual(expectedResponse);
    expect(store.dispatch).toHaveBeenCalled();
  });
});

const defaultStreetSettings = {
  lowIncome: 30,
  highIncome: 60
};

// Helpers
function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

class StoreMock {
  select() {
    return Observable.of({
      streetSettings: {
        poor: defaultStreetSettings.lowIncome,
        rich: defaultStreetSettings.highIncome
      }
    });
  }

  dispatch() {
  }
}
