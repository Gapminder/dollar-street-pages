import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { GuideComponent } from '../../../../src/shared/guide/guide.component';
import { guideContext, welcomeHeader } from './mocks/data';

describe('GuideComponent', () => {
  let mockArticleService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockArticleService.serviceName = 'GuideService';
  mockArticleService.getMethod = 'getGuide';
  mockArticleService.fakeResponse = guideContext;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockArticleService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(GuideComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', () => {
    context.ngOnInit();

    spyOn(context.guideServiceSubscribe, 'unsubscribe');

    expect(context.description).toEqual(welcomeHeader.description);
    expect(context.bubbles.length).toEqual(5);

    context.ngOnDestroy();

    expect(context.guideServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('openQuickGuide', () => {
    spyOn(context.startQuickGuide, 'emit');

    context.openQuickGuide();

    expect(context.isShowGuide).toEqual(false);
    expect(context.isShowBubble).toEqual(true);
    expect(context.startQuickGuide.emit).toHaveBeenCalledWith({});
  });

  it('close', () => {
    spyOn(context.startQuickGuide, 'emit');

    context.close();

    expect(context.isShowGuide).toEqual(false);
    expect(context.startQuickGuide.emit).toHaveBeenCalledWith({});
  });
});
