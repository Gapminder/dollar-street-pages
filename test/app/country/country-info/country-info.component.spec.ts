import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../common-mocks/mocked.services';
import { MockService } from '../../common-mocks/mock.service.template';
import { info } from '../mocks/data';
import { CountryInfoComponent } from '../../../../src/country/country-info/country-info.component';

describe('CountryInfoComponent', () => {
  let countryInfoService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  countryInfoService.serviceName = 'CountryInfoService';
  countryInfoService.getMethod = 'getCountryInfo';
  countryInfoService.fakeResponse = info;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      countryInfoService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(CountryInfoComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('must init', ()=> {
    fixture.detectChanges();
    expect(context.placesQuantity).toEqual(7);
    expect(context.photosQuantity).toEqual(1223);
    countryInfoService.toInitState();
  });

  it('must destroy', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(countryInfoService.countOfSubscribes).toBe(0);
  });
});
