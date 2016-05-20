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

import {MockCommonDependency} from '../../app/common-mocks/mocked.services';
import {MockService} from '../common-mocks/mock.service.template.ts';
import {PlaceComponent} from '../../../app/place/place.component';
import {streetPlacesData} from './mocks/data.ts';

describe('PlaceComponent', () => {
  let streetPlaces = new MockService();
  streetPlaces.serviceName = 'PlaceStreetService';
  streetPlaces.getMethod = 'getThingsByRegion';
  streetPlaces.fakeResponse = streetPlacesData;
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  let context;
  let fixture;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
      return tcb
        .overrideTemplate(PlaceComponent, `<div></div>`)
        .createAsync(PlaceComponent)
        .then((componentFixture:any) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.routeParams.set('thing', '5477537786deda0b00d43be5');
          context.routeParams.set('image', '54b6862f3755cbfb542c28cb');
          context.routeParams.set('place', '54b6866a38ef07015525f5be');
        });
    }
  )));
  it('must init', () => {
    spyOn(context, 'getStreetPlaces');
    spyOn(context.controllSlider, 'subscribe');
    fixture.detectChanges();
    expect(context.query).toEqual(`thing=5477537786deda0b00d43be5&place=54b6866a38ef07015525f5be&image=54b6862f3755cbfb542c28cb`);
    expect(context.getStreetPlaces).toHaveBeenCalledWith(context.query);
    expect(context.controllSlider.subscribe).toHaveBeenCalled();
    expect(context.loader).toEqual(false);
  });
  it('urlChanged', () => {
    spyOn(context, 'getStreetPlaces');
    fixture.detectChanges();
    context.place = '54b6866a38ef07015525f5be';
    context.init = false;
    spyOn(context, 'urlChanged').and.callThrough();
    context.urlChanged({_id: '5477537786deda0b00d43eee'});
    expect(context.activeThing._id).toEqual('5477537786deda0b00d43eee');
    context.place = '54b6866a38ef07015525f5be';
    expect(context.thing).toEqual('5477537786deda0b00d43eee');
    expect(context.getStreetPlaces.calls.argsFor(1)).toEqual([`thing=5477537786deda0b00d43eee&place=54b6866a38ef07015525f5be&isSearch=true`]);
  });
  it('choseCurrentPlace', () => {
    context.thing = '5477537786deda0b00d43be5';
    spyOn(context, 'getStreetPlaces');
    spyOn(context.chosenPlaces, 'next');
    spyOn(context, 'changeLocation');
    spyOn(context, 'choseCurrentPlace').and.callThrough();
    context.choseCurrentPlace([streetPlacesData[0]]);
    expect(context.currentPlace._id).toEqual(streetPlacesData[0]._id);
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.changeLocation.calls.argsFor(0)).toEqual([streetPlacesData[0], '5477537786deda0b00d43be5']);
  });
  it('changeLocation', () => {
    context.init = false;
    spyOn(context.urlChangeService, 'replaceState');
    spyOn(context, 'changeLocation').and.callThrough();
    let place = streetPlacesData[0];
    context.changeLocation(place, '5477537786deda0b00d43be5');
    expect(context.place).toEqual(place._id);
    expect(context.image).toEqual(place.image);
    expect(context.image).toEqual(place.image);
    expect(context.urlChangeService.replaceState.calls.argsFor(0))
      .toEqual(['/place', `thing=5477537786deda0b00d43be5&place=${place._id}&image=${place.image}`]);
    expect(context.routeParams.params).toEqual({
      'thing': '5477537786deda0b00d43be5',
      'place': place._id,
      'image': place.image
    });
  });
});
