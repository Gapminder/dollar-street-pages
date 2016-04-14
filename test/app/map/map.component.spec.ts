/**
 * Created by igor on 4/4/16.
 */

import {
  it,
  xit,
  describe,
  expect,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services.ts';
import {MockService} from '../common-mocks/mock.service.template.ts';
import {mapdata} from './mocks/data.ts';
import {MapComponent} from '../../../app/map/map.component';

/** todo: remove this crutch */
interface ObjectCreator extends ObjectConstructor {
  assign(target:any, ...sources:any[]):any;
}
declare var Object:ObjectCreator;
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
/*** *************/

describe('MapComponent', () => {
  let mockMapService = new MockService();
  let mockCommonDependency = new MockCommonDependency();
  mockMapService.serviceName = 'MapService';
  mockMapService.getMethod = 'getMainPlaces';
  mockMapService.fakeResponse = mapdata;
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockMapService.getProviders()
    ];
  });
  let fixture;
  let context;

  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(MapComponent, `<div></div>`)
        .createAsync(MapComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.routeParams.set('thing', '5477537786deda0b00d43be5');
        });
    }
  ));

  it(' must init', () => {
    /** need solve a router state in header component -> search*/
    spyOn(context, 'urlChanged');
    spyOn(context, 'ngOnInit').and.callThrough();
    context.ngOnInit();
    expect(context.init).toEqual(true);
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.urlChanged).toHaveBeenCalledWith('5477537786deda0b00d43be5');
  });
  xit('urlChanged', () => {
    spyOn(context, 'urlChanged').and.callThrough();
    spyOn(context, 'setMarkersCoord');
    spyOn(context, 'urlChangeService');
    context.urlChanged('5477537786deda0b00d43be5');
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.query).toEqual('thing=5477537786deda0b00d43be5');
    expect(context.loader).toEqual(true);
    expect(context.places.length).toEqual(8);
    expect(context.countries.length).toEqual(3);
    expect(context.setMarkersCoord.calls.argsFor(0)).toEqual([context.places]);
    //expect(context.mapServiceSubscribe.countOfSubscribes).toEqual(0);
  });

  xit(' must hoverOnMarker', () => {
    context.isDesktop = true;
    fixture.detectChanges();
    context.hoverOnMarker(1, 'Ukraine');
    expect(context.markers.length).toEqual(8);
    expect(context.onMarker).toEqual(true);
    expect(context.currentCountry).toEqual('Ukraine');
    expect(context.lefSideCountries.length).toEqual(2);
    expect(context.seeAllHomes).toEqual(true);
    expect(context.hoverPlace._id).toEqual('54b6862f3755c45b542c28cb');
    /**todo: test coords*/
  });
  xit(' must unHoverOnMarker', () => {
    context.isDesktop = true;
    context.isOpenLeftSide = true;
    context.hoverOnMarker(1, 'Ukraine');
    fixture.detectChanges();
    context.isOpenLeftSide = false;
    context.unHoverOnMarker();
    fixture.detectChanges();
    expect(context.onMarker).toEqual(false);
    expect(context.seeAllHomes).toEqual(false);
    expect(context.hoverPlace).toEqual(null);
    expect(context.hoverPortraitTop).toEqual(null);
    expect(context.hoverPortraitLeft).toEqual(null);
    expect(context.markers).toEqual(null);
  });
});
