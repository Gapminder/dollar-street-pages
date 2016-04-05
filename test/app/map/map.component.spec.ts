/**
 * Created by igor on 4/4/16.
 */

import {
  it,
  xit,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services.ts';
import {MockService} from '../common-mocks/mock.service.template.ts';
import {mapdata} from './mocks/data.ts';
import {MapComponent} from '../../../app/map/map.component';


describe('MapComponent', () => {
  let mockMapService = new MockService();
  mockMapService.serviceName = 'MapService';
  mockMapService.getMethod = 'getMainPlaces';
  mockMapService.fakeResponse = mapdata;
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      mockMapService.getProviders()
    ];
  });
  xit('MapComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MapComponent).then((fixture) => {
      /**
       * ToDo: fix this case
       */
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.places.length).toEqual(8);
      expect(context.countries.length).toEqual(6);
    });
  }));
});
