import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { SocialShareButtonsComponent } from '../../../../src/shared/social-share-buttons/social-share-buttons.component';

describe('SocialShareButtonsComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(SocialShareButtonsComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.socialShareButtonsServiceSubscribe, 'unsubscribe');

    context.ngOnDestroy();
    expect(context.socialShareButtonsServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('openPopUp', ()=> {
    spyOn(context, 'openPopUp').and.callThrough();

    context.openPopUp('https://plus.google.com/share?url=');
    expect(context.openPopUp).toHaveBeenCalledWith('https://plus.google.com/share?url=');
  });
});
