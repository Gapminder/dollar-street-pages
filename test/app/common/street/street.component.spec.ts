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

// import {MockCommonDependency} from '../../../app/common-mocks/mocked.services.ts';
// import {MockService} from '../../common-mocks/mock.service.template.ts';
// import {mapdata} from './mocks/data.ts';
import {StreetComponent} from '../../../../app/common/street/street.component';

/** todo: remove this crutch */
// interface ObjectCtor extends ObjectConstructor {
//   assign(target:any, ...sources:any[]):any;
// }
// declare var Object:ObjectCtor;
// export let assign = Object.assign ? Object.assign : function (target:any, ...sources:any[]):any {
//   return;
// };
//
// class Image {
//   set onload(fn) {
//     fn();
//   }
// }
// let ImageMock = {
//   Image: Image
// };
// let setTimeoutMock = {
//   setTimeout: (fn, time) => {
//     fn();
//   }
// };
// assign(window, ImageMock);
// assign(window, setTimeoutMock);
/**
 * *************/

// describe('MapComponent', () => {
//   let mockMapService = new MockService();
//   let mockCommonDependency = new MockCommonDependency();
//   mockMapService.serviceName = 'MapService';
//   mockMapService.getMethod = 'getMainPlaces';
//   mockMapService.fakeResponse = mapdata;
//   beforeEachProviders(() => {
//     return [
//       mockCommonDependency.getProviders(),
//       mockMapService.getProviders()
//     ];
//   });
//   xit(' must init', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(MapComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       /** need solve a router state in header component -> search*/
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       spyOn(context.urlChangeService, 'replaceState');
//       console.log(context.router.hostComponent)
//       fixture.detectChanges();
//       expect(context.urlChangeService.replaceState).toHaveBeenCalledWith('/map', 'thing=5477537786deda0b00d43be5');
//       expect(context.init).toEqual(true);
//       expect(context.places.length).toEqual(8);
//       expect(context.countries.length).toEqual(3);
//       expect(context.query).toEqual('thing=5477537786deda0b00d43be5');
//       expect(context.loader).toEqual(true);
//       mockMapService.toInitState();
//     });
//   }));
//   xit(' must destroy', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(MapComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       fixture.detectChanges();
//       fixture.destroy()
//       expect(context.mapServiceSubscribe.countOfSubscribes).toEqual(0);
//     });
//   }));
//
//   xit(' must hoverOnMarker', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(MapComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.isDesktop = true;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       fixture.detectChanges();
//       context.hoverOnMarker(1, 'Ukraine')
//       expect(context.markers.length).toEqual(8);
//       expect(context.onMarker).toEqual(true);
//       expect(context.currentCountry).toEqual('Ukraine');
//       expect(context.lefSideCountries.length).toEqual(2);
//       expect(context.seeAllHomes).toEqual(true);
//       expect(context.hoverPlace._id).toEqual('54b6862f3755c45b542c28cb');
//       /**todo: test coords*/
//     });
//   }));
//   xit(' must unHoverOnMarker', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(MapComponent).then((fixture) => {
//        let context = fixture.debugElement.componentInstance;
//       context.isDesktop = true;
//       context.isOpenLeftSide = true;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       context.hoverOnMarker(1, 'Ukraine');
//       fixture.detectChanges();
//       console.log(context.markers)
//       context.isOpenLeftSide = false;
//       context.unHoverOnMarker();
//       fixture.detectChanges();
//       expect(context.onMarker).toEqual(false);
//       expect(context.seeAllHomes).toEqual(false);
//       expect(context.hoverPlace).toEqual(null);
//       expect(context.hoverPortraitTop).toEqual(null);
//       expect(context.hoverPortraitLeft).toEqual(null);
//       expect(context.markers).toEqual(null);
//     });
//   }));
// });
