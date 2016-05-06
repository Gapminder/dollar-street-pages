import {
  it,
  describe,
  inject,
  async,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {FamilyPlaceComponent} from '../../../../app/place/family/family-place.component';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {places, place} from '../mocks/data.ts';

describe('FamilyPlaceComponent', () => {
  let placesObservable:MockService;
  let mockFamilyPlaceService:MockService;
  beforeEachProviders(() => {
    placesObservable = new MockService();
    mockFamilyPlaceService = new MockService();
    placesObservable.fakeResponse = place;
    mockFamilyPlaceService.serviceName = 'FamilyPlaceService';
    mockFamilyPlaceService.getMethod = 'getPlaceFamilyImages';
    mockFamilyPlaceService.fakeResponse = places;
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      mockFamilyPlaceService.getProviders()
    ];
  });
  let context, fixture;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(FamilyPlaceComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));
  it(' must init ', ()=> {
    context.chosenPlaces = placesObservable;
    fixture.detectChanges();
    expect(context.placeId).toEqual('54b6862f3755cbfb542c28cb');
    expect(context.images.length).toEqual(5);
    placesObservable.toInitState();
    mockFamilyPlaceService.toInitState();
  });
  it(' must destroy ', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(placesObservable.countOfSubscribes).toEqual(0);
    expect(mockFamilyPlaceService.countOfSubscribes).toEqual(0);
  });
});
