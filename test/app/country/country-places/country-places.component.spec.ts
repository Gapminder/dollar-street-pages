import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../common-mocks/mocked.services.ts'
import {MockService} from '../../common-mocks/mock.service.template.ts'
import {places} from "../mocks/data.ts";

import {CountryPlacesComponent} from '../../../../app/country/country-places/country-places.component';

describe("CountryPlacesComponent", () => {
  let countryPlacesService = new MockService();
  countryPlacesService.serviceName = 'CountryPlacesService';
  countryPlacesService.getMethod = 'getCountryPlaces';
  countryPlacesService.fakeResponse = places;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      countryPlacesService.getProviders()
    ];
  });
  it("CountryPlaceComponent must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(CountryPlacesComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.places.length).toEqual(3);
      expect(context.loader).toEqual(true)
    })
  }));
  it("CountryPlaceComponent must destroy ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(CountryPlacesComponent).then((fixture) => {
      fixture.detectChanges();
      fixture.destroy();
      expect(countryPlacesService.isUnsubscribe).toBe(true);
    })
  }));
});

