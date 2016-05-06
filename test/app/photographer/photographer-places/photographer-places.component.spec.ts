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

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../../app/common-mocks/mock.service.template';
import {places} from '../mocks/data.ts';

import {PhotographerPlacesComponent} from '../../../../app/photographer/photographer-places/photographer-places.component';

describe('PhotographerPlacesComponent', () => {
  let mockPhotographerPlacesService = new MockService();
  mockPhotographerPlacesService.serviceName = 'PhotographerPlacesService';
  mockPhotographerPlacesService.getMethod = 'getPhotographerPlaces';
  mockPhotographerPlacesService.fakeResponse = places;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockPhotographerPlacesService.getProviders()
    ];
  });
  let context, fixture, nativeElement;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(PhotographerPlacesComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));
  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();
    expect(context.places).toEqual(places.data.places);
    expect(context.familyThingId).toEqual(places.data.familyThingId);
    expect(context.loader).toEqual(true);
    spyOn(context.photographerPlacesServiceSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.photographerPlacesServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
