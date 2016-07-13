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

import {provide} from '@angular/core';

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


  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(StreetComponent, `<div></div>`)
        .createAsync(StreetComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
        });
    }
  )));

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
  xit('ngOnDestroy', () => {
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
    context.mouseMoveSubscriber = {
      unsubscribe: () => {
      }
    };
    context.StreetServiceSubscrib = {
      unsubscribe: () => {
      }
    };
    spyOn(context.resize, 'unsubscribe');
    spyOn(context.placesSubscribe, 'unsubscribe');
    spyOn(context.hoverPlaceSubscribe, 'unsubscribe');
    spyOn(context.chosenPlacesSubscribe, 'unsubscribe');
    spyOn(context.mouseMoveSubscriber, 'unsubscribe');
    spyOn(context.StreetServiceSubscrib, 'unsubscribe');
  });
});
