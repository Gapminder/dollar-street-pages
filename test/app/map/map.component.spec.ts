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

let tmpl = require('./mocks/map.template.html');

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
        .overrideTemplate(MapComponent, tmpl)
        .createAsync(MapComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.routeParams.set('thing', '546ccf730f7ddf45c0179688');
        });
    }
  ));

  it(' ngOnInit', () => {
    /** need solve a router state in header component -> search*/
    spyOn(context, 'urlChanged');
    spyOn(context, 'ngOnInit').and.callThrough();
    context.ngOnInit();
    expect(context.init).toEqual(true);
    expect(context.thing).toEqual('546ccf730f7ddf45c0179688');
    expect(context.urlChanged).toHaveBeenCalledWith('546ccf730f7ddf45c0179688');
  });
  it('urlChanged', () => {
    spyOn(context, 'urlChanged').and.callThrough();
    spyOn(context, 'setMarkersCoord');
    spyOn(context, 'urlChangeService');
    context.urlChanged('546ccf730f7ddf45c0179688');
    expect(context.thing).toEqual('546ccf730f7ddf45c0179688');
    expect(context.query).toEqual('thing=546ccf730f7ddf45c0179688');
    expect(context.loader).toEqual(true);
    expect(context.places.length).toEqual(175);
    expect(context.countries.length).toEqual(17);
    expect(context.setMarkersCoord.calls.argsFor(0)).toEqual([context.places]);
  });
  it('setMarkersCoord', () => {
    spyOn(context, 'setMarkersCoord').and.callThrough();
    context.setMarkersCoord(mapdata.data.places);
    /**write test*/
  });


  xit(' hoverOnMarker', () => {
    /**todo: test */
  });
  xit(' unHoverOnMarker', () => {
    /**todo: test */
  });
  xit(' hoverOnFamily', () => {
    /**todo: test */
  });
  xit(' unHoverOnFamily', () => {
    /**todo: test */
  });
  it(' openLeftSideBar', () => {
    spyOn(context, 'openLeftSideBar').and.callThrough();
    context.openLeftSideBar();
    expect(context.isOpenLeftSide).toEqual(true);
  });
  it(' closeLeftSideBar', () => {
    spyOn(context, 'closeLeftSideBar').and.callThrough();
    /**todo remove this*/
    let e = {
      target: {
        classList: {
          contains: () => {
          }
        }
      }
    };
    let eCall = spyOn(e.target.classList, 'contains').and.returnValue(true);
    spyOn(context, 'unHoverOnMarker');
    context.closeLeftSideBar(e);
    expect(context.onMarker).toEqual(false);
    expect(context.onThumb).toEqual(false);
    expect(context.seeAllHomes).toEqual(false);
    expect(context.hoverPlace).toEqual(null);
    expect(context.hoverPortraitTop).toEqual(null);
    expect(context.hoverPortraitLeft).toEqual(null);
    expect(context.unHoverOnMarker.calls.argsFor(0)).toEqual([e]);
    eCall.and.returnValue(false);
    context.closeLeftSideBar(e);
    expect(context.isOpenLeftSide).toEqual(false);
    expect(context.onMarker).toEqual(false);
    expect(context.onThumb).toEqual(false);
    /**!e.target.classList.contains('marker')*/
  });

  it(' clickOnMarker', () => {
    spyOn(context, 'clickOnMarker').and.callThrough();
    spyOn(context, 'closeLeftSideBar');
    spyOn(context, 'hoverOnMarker');
    context.isOpenLeftSide = true;
    let e = {event: 'test'};
    context.clickOnMarker(e, 134, 'United Kingdom');
    expect(context.isOpenLeftSide).toEqual(false);
    expect(context.closeLeftSideBar.calls.argsFor(0)).toEqual([e]);
    expect(context.hoverOnMarker.calls.argsFor(0)).toEqual([134, 'United Kingdom']);
    context.isOpenLeftSide = false;
    context.lefSideCountries = [mapdata.data.places[0]];
    context.hoverPlace = mapdata.data.places[0];
    spyOn(context.router, 'navigate');
    context.clickOnMarker(e, 134, 'United Kingdom');
    expect(context.router.navigate.calls.argsFor(0)).toEqual([['Place', {
      thing: context.hoverPlace.familyImg.thing,
      place: context.hoverPlace._id,
      image: context.hoverPlace.familyImg.imageId
    }]]);
  });
  it('mobileClickOnMarker', () => {
    spyOn(context, 'mobileClickOnMarker').and.callThrough();
    spyOn(context, 'openLeftSideBar');
    context.places = mapdata.data.places;
    context.mobileClickOnMarker('United States');
    expect(context.currentCountry).toEqual('United States');
    expect(context.lefSideCountries.length).toEqual(6);
    expect(context.openLeftSideBar).toHaveBeenCalled();
  });
  it('thumbHover', () => {
    spyOn(context, 'thumbHover').and.callThrough();
    context.thumbHover();
    expect(context.onThumb).toEqual(true);
  });
  it('toUrl', () => {
    expect(context.toUrl('http://some.com')).toEqual('url("http://some.com")');
  });
});
