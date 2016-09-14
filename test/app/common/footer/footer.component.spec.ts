import { it, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { FooterComponent } from '../../../../app/common/footer/footer.component';
import { MockService } from '../../common-mocks/mock.service.template';
import { footerInfo } from './mocks/data';
describe('FooterComponent', () => {
  let mockFooterService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockFooterService.serviceName = 'FooterService';
  mockFooterService.getMethod = 'getFooter';
  mockFooterService.fakeResponse = footerInfo;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockFooterService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(FooterComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    expect(context.footerData).toEqual(footerInfo.data);
    spyOn(context.footerServiceSubscribe, 'unsubscribe');
    spyOn(context.routerEventsSubscribe, 'unsubscribe');

    context.ngOnDestroy();
    expect(context.footerServiceSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('goToMatrixPage', () => {
    context.goToMatrixPage();
  });
});
