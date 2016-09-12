import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MatrixImagesComponent } from '../../../../app/matrix/matrix-images/matrix-images.component';
import { Observable } from 'rxjs';

describe('MatrixImagesComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(MatrixImagesComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      context.places = Observable.of([{
        _id: '547c4bc9b787bd0b00dcfb5b',
        background: 'http://static.dollarstreet.org.s3.amazonaws.com/media/South Africa 1/image/2dac72df-d013-4b01-a616-b22791d556a6/desktops-2dac72df-d013-4b01-a616-b22791d556a6.jpg',
        country: 'South Africa',
        image: '547c4f02b787bd0b00dcfc6e',
        income: 148.1,
        incomeQuality: 10,
        isUploaded: true,
        lat: -29,
        lng: 24,
        region: 'Africa'
      }]);
      context.clearActiveHomeViewBox = Observable.of(true);
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.placesSubscribe, 'unsubscribe');
    spyOn(context.resizeSubscribe, 'unsubscribe');
    spyOn(context.clearActiveHomeViewBoxSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.placesSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.clearActiveHomeViewBoxSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('onScrollDown', () => {
    spyOn(context, 'onScrollDown').and.callThrough();

    context.onScrollDown();
  });

  it('toUrl', () => {
    expect(context.toUrl('http://some.com')).toEqual('url("http://some.com")');
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
