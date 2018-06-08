import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { countriesFilterReducer } from '../ngrx/countries-filter.reducers';

import { AppStates } from '../../../interfaces';
import { CountriesFilterComponent } from '../countries-filter.component';
import { CountriesFilterPipe } from '../countries-filter.pipe';

import { UrlParametersService } from "../../../url-parameters/url-parameters.service";
import { CommonServicesTestingModule } from "../../../test/commonServicesTesting.module";
import { forEach } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

describe('CountriesFilterComponent', () => {
  let fixture: ComponentFixture<CountriesFilterComponent>;
  let component: CountriesFilterComponent;
  let store: Store<AppStates>;
  let urlParametersService: UrlParametersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule,
        StoreModule.forRoot({countriesFilterReducer})
      ],
      declarations: [CountriesFilterComponent, CountriesFilterPipe]
    });

    fixture = TestBed.createComponent(CountriesFilterComponent);
    component = fixture.componentInstance;
    urlParametersService = TestBed.get(UrlParametersService);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    forEach(component.ngSubscriptions, (value, key) => {
      spyOn(value, 'unsubscribe');
    });

    component.ngOnDestroy();

    forEach(component.ngSubscriptions, (value, key) => {
      expect(value.unsubscribe).toHaveBeenCalled();
    });

  });

  it('calcSliceCount()', () => {
    spyOn(component.window, 'innerWidth').and.returnValue(1200);
    component.ngOnInit();

    component.isDesktop = true;

    component.calcSliceCount();

    expect(component.sliceCount).toBe(2);
  });

  it('clearAllCountries()', () => {
    component.ngOnInit();

    component.clearAllCountries();

    expect(component.showSelected).toBeTruthy();
    expect(component.regionsVisibility).toBeTruthy();
    expect(component.selectedRegions.length).toBe(0);
    expect(component.selectedCountries.length).toBe(0);
    expect(component.search).toBeFalsy(true);
  });

  it('goToLocation(): should change url parameters', () => {
    component.ngOnInit();
    spyOn(urlParametersService, 'dispatchToStore');
    component.goToLocation();

    expect(urlParametersService.dispatchToStore).toHaveBeenCalledWith({regions: ['World'], countries: ['World']});
  });
});
