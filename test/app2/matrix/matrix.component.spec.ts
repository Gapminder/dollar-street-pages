import { it, describe, async, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { MockService } from '../common-mocks/mock.service.template.ts';
import { MatrixComponent } from '../../../app/matrix/matrix.component';
import { places } from './mocks/data.ts';

let tmpl = require('./mocks/matrix.template.html');

describe('MatrixComponent', () => {
  let matrixService = new MockService();
  matrixService.serviceName = 'MatrixService';
  matrixService.getMethod = 'getMatrixImages';
  matrixService.getMethod = 'getMatrixOnboardingTips';
  matrixService.getMethod = 'getStreetSettings';
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

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
      return tcb
        .overrideTemplate(MatrixComponent, tmpl)
        .createAsync(MatrixComponent)
        .then((componentFixture:any) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.routeParams.set('thing', 'Home');
          context.routeParams.set('countries', 'World');
          context.routeParams.set('regions', 'World');
          context.routeParams.set('row', 1);
          context.routeParams.set('zoom', 5);
          context.routeParams.set('lowIncome', 0);
          context.routeParams.set('highIncome', 15000);
        })
        .catch((err:Error)=> {
          console.error(err);
        });
    }
  )));

  it('ngOnInit', () => {
    spyOn(context, 'ngOnInit').and.callThrough();
    context.ngOnInit();
    expect(context.thing).toEqual('Home');

    expect(context.zoom).toEqual(5);
    expect(context.row).toEqual(1);
    expect(context.regions).toEqual('World');
    expect(context.countries).toEqual('World');
    expect(context.query).toEqual(`thing=${context.thing}&countries=${context.countries}&regions=${context.regions}&zoom=${context.zoom}&row=${context.row}&lowIncome=${context.lowIncome}&highIncome=${context.highIncome}`);
  });

  it(' ngAfterViewChecked', () => {
    spyOn(context, 'ngAfterViewChecked').and.callThrough();
    spyOn(context, 'getPaddings');
    context.ngAfterViewChecked();
  });
  xit(' stopScroll', () => {
    // need logic
  });
  xit(' getPaddings', () => {
    // need logic
  });
  xit(' getViewableRows', () => {
    // need logic
  });
  it(' hoverPlaceS', () => {
    spyOn(context, 'hoverPlaceS').and.callThrough();
    spyOn(context.hoverPlace, 'next');
    context.hoverPlaceS(places.data.zoomPlaces[0]);
    expect(context.hoverPlace.next.calls.argsFor(0)).toEqual([places.data.zoomPlaces[0]]);
  });
  xit(' urlChanged and ngOnDestroy', () => {
    context.filter = {lowIncome: 0, hightIncome: 15000};
    spyOn(context, 'urlChanged').and.callThrough();
    spyOn(context, 'parseUrl').and.callThrough();
    spyOn(context.urlChangeService, 'replaceState');
    spyOn(context.matrixPlaces, 'next');
    spyOn(context.matrixService, 'getMatrixImages').and.callThrough();
    spyOn(context, 'stopScroll');
    context.urlChanged({url: 'thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000'});
    expect(context.query).toEqual('thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000');
    expect(context.parseUrl.calls.argsFor(0)).toEqual(['thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000']);
    expect(context.thing).toEqual('Home');
    expect(context.urlChangeService.replaceState.calls.argsFor(0)).toEqual(['/matrix', 'thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000']);
    expect(context.matrixService.getMatrixImages.calls.argsFor(0)).toEqual([context.query]);
    expect(context.matrixPlaces.next.calls.argsFor(0)).toEqual([places.data.zoomPlaces]);
    expect(context.placesArr).toEqual(places.data.zoomPlaces);
    expect(context.zoom).toEqual(5);
    expect(context.loader).toEqual(true);

    spyOn(context.matrixServiceSubscrib, 'unsubscribe');
    spyOn(context.matrixServiceOnboardingSubscribe, 'unsubscribe');
    // spyOn(context.matrixServiceStreetSubscrib, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.matrixServiceSubscrib.unsubscribe).toHaveBeenCalled();
    expect(context.matrixServiceOnboardingSubscribe.unsubscribe).toHaveBeenCalled();
    // expect(context.matrixServiceStreetSubscrib.unsubscribe).toHaveBeenCalled();
  });

  it(' changeZoom', () => {
    spyOn(context, 'changeZoom').and.callThrough();
    spyOn(context, 'urlChanged');
    context.query = 'thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000';
    context.row = 1;
    context.changeZoom(4);
    expect(context.urlChanged.calls.argsFor(0)).toEqual([{
      url: 'thing=Home&countries=World&regions=World&zoom=4&row=1&lowIncome=0&highIncome=15000',
      isZoom: true
    }]);
  });

  it(' parseUrl', () => {
    spyOn(context, 'parseUrl').and.callThrough();
    let url = 'thing=Home&countries=World&regions=World&zoom=5&row=1&lowIncome=0&highIncome=15000';
    let urlObj = context.parseUrl(url);
    expect(urlObj.thing).toEqual('Home');
    expect(urlObj.countries).toEqual('World');
    expect(urlObj.regions).toEqual('World');
    expect(urlObj.zoom).toEqual('5');
    expect(urlObj.row).toEqual('1');
    expect(urlObj.lowIncome).toEqual('0');
    expect(urlObj.highIncome).toEqual('15000');
  });
});

