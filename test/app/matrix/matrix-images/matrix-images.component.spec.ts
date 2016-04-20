import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../common-mocks/mocked.services.ts';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {places} from '../mocks/data.ts';


import {MatrixImagesComponent} from '../../../../app/matrix/matrix-images/matrix-images.component';

describe('MatrixImagesComponent', () => {
  let placesObservable = new MockService();
  placesObservable.fakeResponse = places.places;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
    ];
  });

  let fixture, context;
  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(MatrixImagesComponent, '<div></div>')
        .createAsync(MatrixImagesComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.thing = '546ccf730f7ddf45c0179658';
          context.zoom = 5;
          context.places = placesObservable;
        });
    }
  ));
  it('ngOnInit ngOnDestroy', () => {
    context.ngOnInit();
    expect(context.itemSize).toEqual(window.innerWidth / context.zoom);
    expect(context.currentPlaces.length).toEqual(places.places.length);
    spyOn(context.placesSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.placesSubscribe.unsubscribe).toHaveBeenCalled();
  });
  it('hoverImage', () => {
    spyOn(context.hoverPlace, 'emit');
    context.oldPlaceId = places.places[0]._id;
    context.hoverImage(places.places[0]);
    expect(context.hoverPlace.emit).toHaveBeenCalledWith(places.places[0]);
    context.isDesktop = false;
    context.hoverImage();
    expect(context.hoverPlace.emit).toHaveBeenCalled();
    expect(context.oldPlaceId).toEqual(null);
  });
  it('goToPlace', () => {
    spyOn(context.router, 'navigate');
    let place = places.places[0];
    context.goToPlace(place);
    expect(context.router.navigate.calls.argsFor(0)[0]).toEqual(['Place', {
      thing: context.thing,
      place: place._id,
      image: place.image
    }]);
    context.isDesktop = false;
    context.oldPlaceId = null;
    context.goToPlace(place);
    expect(context.oldPlaceId).toEqual(place._id);
    context.isDesktop = false;
    context.oldPlaceId =  place._id;
    context.goToPlace(place);
    expect(context.router.navigate.calls.argsFor(1)[0]).toEqual(['Place', {
      thing: context.thing,
      place: place._id,
      image: place.image
    }]);
  });

  it('toUrl', () => {
    expect(context.toUrl('http://example.com/image.jpg')).toEqual('url("http://example.com/image.jpg")');
  });
});
