import {
  it,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services';
import {MockService} from '../common-mocks/mock.service.template.ts';
import {MatrixComponent} from '../../../app/matrix/matrix.component';
import {places} from './mocks/data.ts';

let tmpl = require('./mocks/matrix.template.html');


describe('MatrixComponent', () => {
  let matrixService = new MockService();
  matrixService.serviceName = 'MatrixService';
  matrixService.getMethod = 'getMatrixImages';
  matrixService.fakeResponse = places;
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      matrixService.getProviders()
    ];
  });
  let context;
  let fixture;


  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(MatrixComponent, tmpl)
        .createAsync(MatrixComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.routeParams.set('thing', '5477537786deda0b00d43be5');
          context.routeParams.set('countries', 'World');
          context.routeParams.set('regions', 'World');
          context.routeParams.set('row', 1);
          context.routeParams.set('zoom', 5);
        });
    }
  ));


  it('ngOnInit', () => {
    spyOn(context, 'ngOnInit').and.callThrough();
    context.ngOnInit();
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.zoom).toEqual(5);
    expect(context.row).toEqual(1);
    expect(context.regions).toEqual('World');
    expect(context.countries).toEqual('World');
    expect(context.query).toEqual(`thing=${context.thing}&countries=${context.countries}&regions=${context.regions}&zoom=${context.zoom}&row=${context.row}`);
  });

  it(' ngAfterViewChecked', () => {
    spyOn(context, 'ngAfterViewChecked').and.callThrough();
    spyOn(context, 'getPaddings');
    context.ngAfterViewChecked();
  });
  xit(' stopScroll', () => {

  });
  xit(' getPaddings', () => {

  });
  xit(' getViewableRows', () => {

  });
  it(' hoverPlaceS', () => {
    spyOn(context, 'hoverPlaceS').and.callThrough();
    spyOn(context.hoverPlace, 'next');
    context.hoverPlaceS(places.places[0]);
    expect(context.hoverPlace.next.calls.argsFor(0)).toEqual([places.places[0]]);
  });
  it(' isHover', () => {
    spyOn(context, 'isHover').and.callThrough();
    spyOn(context.hoverHeader, 'next');
    context.isDesktop = true;
    context.isHover();
    expect(context.hoverHeader.next.calls.argsFor(0)).toEqual([null]);
    context.isDesktop = false;
    context.isHover();
    expect(context.hoverHeader.next.calls.count()).toEqual(1);
  });
  it(' urlChanged and ngOnDestroy', () => {
    spyOn(context, 'urlChanged').and.callThrough();
    spyOn(context, 'parseUrl').and.callThrough();
    spyOn(context.urlChangeService, 'replaceState');
    spyOn(context.matrixPlaces, 'next');
    spyOn(context.matrixService, 'getMatrixImages').and.callThrough();
    spyOn(context, 'stopScroll');
    context.urlChanged('thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1');
    expect(context.query).toEqual('thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1');
    expect(context.parseUrl.calls.argsFor(0)).toEqual(['thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1']);
    expect(context.thing).toEqual('5477537786deda0b00d43be5');
    expect(context.urlChangeService.replaceState.calls.argsFor(0)).toEqual(['/matrix', 'thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1']);
    expect(context.matrixService.getMatrixImages.calls.argsFor(0)).toEqual([context.query]);
    expect(context.matrixPlaces.next.calls.argsFor(0)).toEqual([places.places]);
    expect(context.placesArr).toEqual(places.places);
    expect(context.clonePlaces.length).toEqual(places.places.length);
    expect(context.zoom).toEqual(5);
    expect(context.loader).toEqual(true);

    spyOn(context.matrixServiceSubscrib, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.matrixServiceSubscrib.unsubscribe).toHaveBeenCalled();
  });
  it(' changeZoom', () => {
    spyOn(context, 'changeZoom').and.callThrough();
    spyOn(context, 'urlChanged');
    context.query = 'thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1';
    context.row = 1;
    context.changeZoom(4);
    expect(context.urlChanged.calls.argsFor(0)).toEqual(['thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=4&row=1']);
  });
  it(' parseUrl', () => {
    spyOn(context, 'parseUrl').and.callThrough();
    let url = 'thing=5477537786deda0b00d43be5&countries=World&regions=World&zoom=5&row=1';
    let urlObj = context.parseUrl(url);
    expect(urlObj.thing).toEqual('5477537786deda0b00d43be5');
    expect(urlObj.countries).toEqual('World');
    expect(urlObj.regions).toEqual('World');
    expect(urlObj.zoom).toEqual('5');
    expect(urlObj.row).toEqual('1');
  });
});

