import {it, describe, async, inject, beforeEachProviders, beforeEach} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {MockCommonDependency} from '../../common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {activeThing, streetPlacesData} from '../mocks/data.ts';

import {SliderPlaceComponent} from '../../../../app/place/slider/slider-place.component';

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

describe('SliderMobilePlaceComponent', () => {
  let controllSlider = new MockService();
  let places = new MockService();
  let currentPlace = new MockService();
  controllSlider.fakeResponse = 1;
  places.fakeResponse = streetPlacesData;
  let mockCommonDependency = new MockCommonDependency();

  beforeEachProviders(() => {
    return [mockCommonDependency.getProviders()];
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(SliderPlaceComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));
  it('must init', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.places = places;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
    context.routeParams.set('place', '54b6866a38ef07015525f5be');
    fixture.detectChanges();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.image).toEqual('54b6862f3755cbfb542c28cb');
    expect(context.place).toEqual('54b6866a38ef07015525f5be');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(1);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(10);
    controllSlider.toInitState();
    places.toInitState();
  });
  it('must destroy', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.places = places;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
    context.routeParams.set('place', '54b6866a38ef07015525f5be');
    fixture.detectChanges();
    fixture.destroy();
    expect(places.countOfSubscribes).toEqual(0);
    expect(controllSlider.countOfSubscribes).toEqual(0);
  });
  it('slidePrev', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.places = places;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
    context.routeParams.set('place', '54b6866a38ef07015525f5be');
    fixture.detectChanges();
    context.slidePrev();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(0);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(1);
  });
  it('slideNext', ()=> {
    context.currentPlace = currentPlace;
    context.controllSlider = controllSlider;
    context.activeThing = activeThing;
    context.places = places;
    context.routeParams.set('thing', '5477537786deda0b00d43be5');
    context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
    context.routeParams.set('place', '54b6866a38ef07015525f5be');
    fixture.detectChanges();
    context.slideNext();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.allPlaces.length).toEqual(5);
    expect(context.position).toEqual(2);
    expect(context.images.length).toEqual(3);
    expect(context.chosenPlace.income).toEqual(133);
  });
});
