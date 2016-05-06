import {
  it,
  xit,
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
  it('PhotographerPlacesComponent must init',()=>{
    fixture.detectChanges();
    expect(context.places.length).toBe(4);
    mockPhotographerPlacesService.toInitState();
  });
  it('PhotographerPlacesComponent must destroy ', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockPhotographerPlacesService.countOfSubscribes).toBe(0);
  });
  xit('PhotographerPlacesComponent must show on mobile ', ()=>{
    /**
     * ToDo: create some cases for
     * checking mobile rendering
     */
  });
  it('PhotographerPlacesComponent must render places', ()=>{
    fixture.detectChanges();
    let photographerCountryPlaces = nativeElement.querySelectorAll('let photographer-places .place');
    expect(photographerCountryPlaces.length).toBe(4);
  });
});
