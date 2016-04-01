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
  //let countryPlacesService = new MockService();
  // countryPlacesService.serviceName = 'CountryPlacesService';
  // countryPlacesService.getMethod = 'getCountryPlaces';
  // countryPlacesService.fakeResponse = places;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      // countryPlacesService.getProviders()
    ];
  });
  it("MatrixImagesComponent must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MatrixImagesComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      context.thing = '546ccf730f7ddf45c0179658';
      context.zoom = 5;
      context.places = places;
      fixture.detectChanges();
      expect(context.currentPlaces.length).toEqual(5);
      console.log( this.placesSubscribe)
      context.hoverPlace.subscribe((place)=>{
        console.log('@@@@',place)
      })
      context.hoverImage(null,context.currentPlaces[0]);
      
  
    })
  }));
  // it("CountryPlaceComponent must destroy ", injectAsync([TestComponentBuilder], (tcb) => {
  //   return tcb.createAsync(MatrixImagesComponent).then((fixture) => {
  //     fixture.detectChanges();
  //     fixture.destroy();
  //     expect(countryPlacesService.isUnsubscribe).toBe(true);
  //   })
  // }));
});
