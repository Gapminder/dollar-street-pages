import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { blockData } from './mocks/data.ts';
import { MatrixViewBlockComponent } from '../../../../app/matrix/matrix-view-block/matrix-view-block.component';

describe('MatrixViewBlockComponent', () => {
  let mockFamilyInfoService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockFamilyInfoService.serviceName = 'FamilyInfoService';
  mockFamilyInfoService.getMethod = 'getFamilyInfo';
  mockFamilyInfoService.fakeResponse = blockData;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockFamilyInfoService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(MatrixViewBlockComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      context.query = 'thing=Families&countries=World&regions=World&zoom=4&row=1&lowIncome=1&highIncome=15000&activeHouse=2';
      context.thing = 'Families';
      context.place = {
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
      };
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.resizeSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.resizeSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('ngOnChanges', () => {
    spyOn(context, 'ngOnChanges').and.callThrough();
    context.ngOnChanges();

    expect(context.showblock).toEqual(true);

    expect(context.place._id).toEqual('547c4bc9b787bd0b00dcfb5b');
    expect(context.place.background).toEqual('http://static.dollarstreet.org.s3.amazonaws.com/media/South Africa 1/image/2dac72df-d013-4b01-a616-b22791d556a6/desktops-2dac72df-d013-4b01-a616-b22791d556a6.jpg');
    expect(context.place.country).toEqual('South Africa');
    expect(context.place.image).toEqual('547c4f02b787bd0b00dcfc6e');
    expect(context.place.income).toEqual(148.1);
    expect(context.place.incomeQuality).toEqual(10);
    expect(context.place.isUploaded).toEqual(true);
    expect(context.place.lat).toEqual(-29);
    expect(context.place.lng).toEqual(24);
    expect(context.place.region).toEqual('Africa');

    expect(context.thing).toEqual('Families');
    expect(context.privateZoom).toEqual('4');
  });

  it('closeBlock', () => {
    spyOn(context.closeBigImageBlock, 'emit');

    context.closeBlock();

    expect(context.closeBigImageBlock.emit).toHaveBeenCalledWith({});
  });

  it('fancyBoxClose', () => {
    spyOn(context, 'fancyBoxClose').and.callThrough();
    context.fancyBoxClose();
    expect(context.popIsOpen).toEqual(false);
    expect(context.fancyBoxImage).toEqual(void 0);
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
