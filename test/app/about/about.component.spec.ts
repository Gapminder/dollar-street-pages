import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { MockService } from '../../app/common-mocks/mock.service.template';
import { infoContext } from './mocks/data.ts';
import { AboutComponent } from '../../../src/about/about.component';

describe('AboutComponent', () => {
  let mockAboutService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockAboutService.serviceName = 'AboutService';
  mockAboutService.getMethod = 'getInfo';
  mockAboutService.fakeResponse = infoContext;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockAboutService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(AboutComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    expect(context.about).toEqual(infoContext.data);
    spyOn(context.aboutSubscribe, 'unsubscribe');

    context.ngOnDestroy();
    expect(context.aboutSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
