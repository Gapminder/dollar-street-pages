import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../common-mocks/mocked.services.ts';
import { MockService } from '../../common-mocks/mock.service.template.ts';
import { places } from '../mocks/data.ts';
import { CountryPlacesComponent } from '../../../../app/country/country-places/country-places.component';

describe('CountryPlacesComponent', () => {
  let countryPlacesService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  countryPlacesService.serviceName = 'CountryPlacesService';
  countryPlacesService.getMethod = 'getCountryPlaces';
  countryPlacesService.fakeResponse = places;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      countryPlacesService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(CountryPlacesComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('must init', ()=> {
    fixture.detectChanges();
    expect(context.places.length).toEqual(3);
    countryPlacesService.toInitState();
  });

  it('must destroy', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(countryPlacesService.countOfSubscribes).toBe(0);
  });
});
