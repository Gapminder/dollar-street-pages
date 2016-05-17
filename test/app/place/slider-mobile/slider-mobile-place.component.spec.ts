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

import {MockCommonDependency} from '../../common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {activeThing, streetPlacesData} from '../mocks/data.ts';

import {SliderMobilePlaceComponent} from '../../../../app/place/slider-mobile/slider-mobile-place.component';

/** todo: remove this crutch */
interface ObjectCtor extends ObjectConstructor {
  assign(target:any, ...sources:any[]):any;
}
declare var Object:ObjectCtor;
export let assign = Object.assign ? Object.assign : function (target:any, ...sources:any[]):any {
  return;
};

class Image {
  set onload(fn) {
    fn();
  }
}
let ImageMock = {
  Image: Image
};
let setTimeoutMock = {
  setTimeout: (fn, time) => {
    fn();
  }
};
assign(window, ImageMock);
assign(window, setTimeoutMock);
/***************/

describe('SliderPlaceComponent', () => {
  let controllSlider = new MockService();
  let streetPlaces = new MockService();
  let currentPlace = new MockService();
  controllSlider.fakeResponse = 1;
  streetPlaces.fakeResponse = streetPlacesData;
  // currentPlace.fakeResponse = place;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders()
    ];
  });
  let context, fixture;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(SliderMobilePlaceComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    }).catch((e:Error)=> {
      console.log(e);
    });
  })));
  it('must init', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.streetPlaces = streetPlaces;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6866a38ef07015525f5be');
    context.routeParams.set('place', '54b6862f3755cbfb54asda3cb');
    fixture.detectChanges();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.image).toEqual('54b6866a38ef07015525f5be');
    // expect(context.place).toEqual('54b6862f3755cbfb54asda3cb');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(2);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(133);
    controllSlider.toInitState();
    streetPlaces.toInitState();
  });

  it('must destroy', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.streetPlaces = streetPlaces;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6866a38ef07015525f5be');
    context.routeParams.set('place', '54b6862f3755cbfb54asda3cb');
    fixture.detectChanges();
    fixture.destroy();
    expect(streetPlaces.countOfSubscribes).toEqual(0);
    expect(controllSlider.countOfSubscribes).toEqual(0);
  });

  it('slidePrev', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.streetPlaces = streetPlaces;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6866a38ef07015525f5be');
    context.routeParams.set('place', '54b6862f3755cbfb54asda3cb');
    fixture.detectChanges();
    context.slidePrev();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(1);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(10);
  });
  it('slideNext', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.streetPlaces = streetPlaces;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6866a38ef07015525f5be');
    context.routeParams.set('place', '54b6862f3755cbfb54asda3cb');
    fixture.detectChanges();
    context.slideNext();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(3);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(500);
  });
});
