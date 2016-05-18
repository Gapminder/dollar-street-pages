import {
  it,
  describe,
  async,
  inject,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';

import {MockCommonDependency} from '../../common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {info} from '../mocks/data.ts';

import {CountryInfoComponent} from '../../../../app/country/country-info/country-info.component';

describe('CountryInfoComponent', () => {
  let countryInfoService = new MockService();
  countryInfoService.serviceName = 'CountryInfoService';
  countryInfoService.getMethod = 'getCountryInfo';
  countryInfoService.fakeResponse = info;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      countryInfoService.getProviders()
    ];
  });
  let context, fixture;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(CountryInfoComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));
  it('CountryInfoComponent must init ', ()=> {
    fixture.detectChanges();
    expect(context.placesQantity).toEqual(7);
    expect(context.photosQantity).toEqual(1223);
    countryInfoService.toInitState();
  });
  it('CountryInfoComponent must destroy ', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(countryInfoService.countOfSubscribes).toBe(0);
  });
});

