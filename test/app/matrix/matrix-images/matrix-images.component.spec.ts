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


import {MatrixImagesComponent} from '../../../../app/matrix/matrix-images/matrix-images.component';

describe("MatrixImagesComponent", () => {
  let placesObservable = new MockService();
  // countryPlacesService.serviceName = 'CountryPlacesService';
  //placesObservable.getMethod = 'getCountryPlaces';
  placesObservable.fakeResponse = places;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      // countryPlacesService.getProviders()
    ];
  });
  it(" must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MatrixImagesComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      context.thing = '546ccf730f7ddf45c0179658';
      context.zoom = 5;
      context.places = placesObservable;
      fixture.detectChanges();
      expect(context.currentPlaces.length).toEqual(5);
      context.hoverPlace.subscribe((place)=> {
        //console.log('@@@@', place)
      });
      context.hoverImage(null, context.currentPlaces[0]);
      placesObservable.toInitState();
    })
  }));
  it(" must destroy ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MatrixImagesComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      context.thing = '546ccf730f7ddf45c0179658';
      context.zoom = 5;
      context.places = placesObservable;
      fixture.detectChanges();
      fixture.destroy();
      expect(placesObservable.countOfSubscribes).toEqual(0);
    })
  }));
});
