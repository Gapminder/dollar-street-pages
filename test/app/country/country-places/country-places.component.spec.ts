import { it, describe, async, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../common-mocks/mocked.services.ts';
import { MockService } from '../../common-mocks/mock.service.template.ts';
import { places } from '../mocks/data.ts';
import { CountryPlacesComponent } from '../../../../app/country/country-places/country-places.component';

describe('CountryPlacesComponent', () => {
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

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(CountryPlacesComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('CountryPlaceComponent must init ', ()=> {
    fixture.detectChanges();
    expect(context.places.length).toEqual(3);
    expect(context.loader).toEqual(true);
    countryPlacesService.toInitState();
  });

  it('CountryPlaceComponent must destroy ', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(countryPlacesService.countOfSubscribes).toBe(0);
  });
});
