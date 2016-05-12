/**
 * Created by igor on 4/4/16.
 */

import {
  it,
  xit,
  describe,
  expect,
  beforeEach,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {provide} from 'angular2/core';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {StreetComponent} from '../../../../app/common/street/street.component';
import {places} from './mocks/data.ts';

class StreetDrawServiceMock {
  public width:number;
  public height:number;
  public halfOfHeight:number;

  public init():this {
    return this;
  }

  public set setSvg(element:HTMLElement) {
  }

  public set(key, val):this {
    this[key] = val;
    return this;
  };

  public onSvgHover(positionX, cb) {
  };

  public drawScale(places) {
    return this;
  };

  public drawHouses(places):this {
    return this;
  };

  public drawHoverHouse(place, gray = false):this {
    return this;
  };

  public clearAndRedraw(places, slider = false):this {
    return this;
  };

  public removeHouses(selector):this {
    return this;
  };

  public clearSvg():this {
    return this;
  };
}

let placesSub = new MockService();
placesSub.fakeResponse = places;

describe('StreetComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      provide('StreetDrawService', {useClass: StreetDrawServiceMock})
    ];
  });
  let context;
  let fixture;


  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(StreetComponent, `<div></div>`)
        .createAsync(StreetComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
        });
    }
  ));

  xit('ngOnInit', () => {
    context.places = placesSub;
    spyOn(context.street, 'clearSvg').and.callThrough();
    spyOn(context.street, 'init').and.callThrough();
    spyOn(context.street, 'drawScale').and.callThrough();
    spyOn(context.street, 'set').and.callThrough();
    spyOn(_, 'sortBy').and.callThrough();
    spyOn(_, 'chain').and.callThrough();
    spyOn(_, 'map').and.returnValue({
      value: () => {
        return true;
      }
    });
    spyOn(_, 'value');
    context.ngOnInit();
    expect(context.street.clearSvg).toHaveBeenCalled();
    expect(context.street.init).toHaveBeenCalled();
    expect(context.street.drawScale).toHaveBeenCalledWith(places);
    expect(context.street.set).toHaveBeenCalledWith(places, true);
    expect(context.street.set).toHaveBeenCalledWith('fullIncomeArr', true);
    expect(_.chain).toHaveBeenCalledWith(places);
    expect(_.sortBy).toHaveBeenCalledWith('income');
    expect(_.map).toHaveBeenCalled();
  });
  xit('onStreet', () => {

  });
  it('ngOnDestroy', () => {
    context.resize = {
      unsubscribe: () => {
      }
    };
    context.placesSubscribe = {
      unsubscribe: () => {
      }
    };
    context.hoverPlaceSubscribe = {
      unsubscribe: () => {
      }
    };
    context.chosenPlacesSubscribe = {
      unsubscribe: () => {
      }
    };
    spyOn(context.resize, 'unsubscribe');
    spyOn(context.placesSubscribe, 'unsubscribe');
    spyOn(context.hoverPlaceSubscribe, 'unsubscribe');
    spyOn(context.chosenPlacesSubscribe, 'unsubscribe');
  });
  it('thumbHover', () => {
    spyOn(context, 'thumbHover').and.callThrough();
    // spyOn(context.hoverPlace, 'next');
    spyOn(context.street, 'removeHouses');
    spyOn(context.street, 'set');
    spyOn(context.street, 'drawHoverHouse');
    let testObj = {place: 'test'};
    context.thumbHover(testObj);
    expect(context.street.removeHouses.calls.argsFor(0))
      .toEqual(['chosen']);
    expect(context.street.removeHouses.calls.argsFor(1))
      .toEqual(['hover']);
    expect(context.street.set.calls.argsFor(0))
      .toEqual(['hoverPlace', testObj]);
    expect(context.street.drawHoverHouse.calls.argsFor(0))
      .toEqual([testObj]);
  });
  it('thumbUnhover', () => {
    spyOn(context, 'thumbUnhover').and.callThrough();
    // spyOn(context.hoverPlace, 'next');
    spyOn(context.street, 'removeHouses');
    spyOn(context.street, 'clearAndRedraw');
    context.thumbUnhover();
    expect(context.street.hoverPlace).toEqual(null);
    expect(context.street.clearAndRedraw.calls.argsFor(0))
      .toEqual([context.street.chosenPlaces]);
  });
  it('toUrl', () => {
    expect(context.toUrl('http://example.com/image-desktops.jpg')).toEqual('url("http://example.com/image-150x150.jpg")');
  });

  it('clickOnThumb', () => {
    spyOn(context.router, 'navigate');
    context.controllSlider = new MockService();
    spyOn(context.controllSlider, 'next');
    context.street.places = places.places;
    let thing = '546ccf730f7ddf45c0179673';
    let place = places.places[1];
    context.clickOnThumb(thing, place);
    expect(context.isThumbView).toEqual(false);
    expect(context.controllSlider.next).toHaveBeenCalledWith(1);
    context.controllSlider = null;
    context.clickOnThumb(thing, place);
    expect(context.router.navigate).toHaveBeenCalledWith(['Place', {
      thing: thing,
      place: place._id,
      image: place.image
    }]);
  });
});
