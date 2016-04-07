import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';


import {MockCommonDependency} from '../../common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {places, place, activeThing, streetPlacesData} from '../mocks/data.ts';

import {SliderMobilePlaceComponent} from '../../../../app/place/slider-mobile/slider-mobile-place.component';



// /** todo: remove this crutch */
// interface ObjectCtor extends ObjectConstructor {
//   assign(target: any, ...sources: any[]): any;
// }
// declare var Object: ObjectCtor;
// export let assign = Object.assign ? Object.assign : function(target: any, ...sources: any[]): any {
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
// /**
//  * *************/
//
// describe('SliderPlaceComponent', () => {
//   let controllSlider = new MockService();
//   let streetPlaces = new MockService();
//   let currentPlace = new MockService();
//   controllSlider.fakeResponse = 1;
//   streetPlaces.fakeResponse = streetPlacesData;
//   // currentPlace.fakeResponse = place;
//   let mockCommonDependency = new MockCommonDependency();
//   beforeEachProviders(() => {
//     return [
//       mockCommonDependency.getProviders()
//     ];
//   });
//   beforeEach(() => {
//     /*** find better solution*/
//
//   })
//   it('must init', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(SliderPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.currentPlace = currentPlace;
//       context.controllSlider = controllSlider;
//       context.activeThing = activeThing;
//       context.streetPlaces = streetPlaces;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
//       context.routeParams.set('place', '54b6866a38ef07015525f5be');
//       fixture.detectChanges();
//       expect(context.thing).toEqual('5477537786deda0b00d43be5');
//       expect(context.image).toEqual('54b6862f3755cbfb542c28cb');
//       expect(context.place).toEqual('54b6866a38ef07015525f5be');
//       expect(context.allPlaces.length).toEqual(5);
//       expect(context.position).toEqual(1);
//       expect(context.images.length).toEqual(3);
//       expect(context.chosenPlace.income).toEqual(10);
//       controllSlider.toInitState();
//       streetPlaces.toInitState();
//     });
//   }));
//   it('must destroy', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(SliderPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.currentPlace = currentPlace;
//       context.controllSlider = controllSlider;
//       context.activeThing = activeThing;
//       context.streetPlaces = streetPlaces;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
//       context.routeParams.set('place', '54b6866a38ef07015525f5be');
//       fixture.detectChanges();
//       fixture.destroy();
//       expect(streetPlaces.countOfSubscribes).toEqual(0);
//       expect(controllSlider.countOfSubscribes).toEqual(0);
//     });
//   }));
//   it('slidePrev', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(SliderPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.currentPlace = currentPlace;
//       context.controllSlider = controllSlider;
//       context.activeThing = activeThing;
//       context.streetPlaces = streetPlaces;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
//       context.routeParams.set('place', '54b6866a38ef07015525f5be');
//       fixture.detectChanges();
//       context.slidePrev();
//       expect(context.thing).toEqual('5477537786deda0b00d43be5');
//       expect(context.allPlaces.length).toEqual(5);
//       expect(context.position).toEqual(0);
//       expect(context.images.length).toEqual(3);
//       expect(context.chosenPlace.income).toEqual(1);
//     });
//   }));
//   it('slideNext', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(SliderPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.currentPlace = currentPlace;
//       context.controllSlider = controllSlider;
//       context.activeThing = activeThing;
//       context.streetPlaces = streetPlaces;
//       context.routeParams.set('thing', '5477537786deda0b00d43be5');
//       context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
//       context.routeParams.set('place', '54b6866a38ef07015525f5be');
//       fixture.detectChanges();
//       context.slideNext();
//       expect(context.thing).toEqual('5477537786deda0b00d43be5');
//       expect(context.allPlaces.length).toEqual(5);
//       expect(context.position).toEqual(2);
//       expect(context.images.length).toEqual(3);
//       expect(context.chosenPlace.income).toEqual(133);
//     });
//   }));
// });
