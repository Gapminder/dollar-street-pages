import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { places } from '../mocks/data';
import { PhotographerPlacesComponent } from '../../../../src/photographer/photographer-places/photographer-places.component';

describe('PhotographerPlacesComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  let mockPhotographerPlacesService = new MockService();

  mockPhotographerPlacesService.serviceName = 'PhotographerPlacesService';
  mockPhotographerPlacesService.getMethod = 'getPhotographerPlaces';
  mockPhotographerPlacesService.fakeResponse = places;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockPhotographerPlacesService.getProviders()
    ]);
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(PhotographerPlacesComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    expect(context.places).toEqual(places.data.places);
    spyOn(context.photographerPlacesServiceSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.photographerPlacesServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
