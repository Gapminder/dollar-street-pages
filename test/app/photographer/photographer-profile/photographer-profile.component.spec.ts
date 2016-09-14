import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { profile } from '../mocks/data.ts';
import { PhotographerProfileComponent } from '../../../../app/photographer/photographer-profile/photographer-profile.component';

describe('PhotographerProfileComponent', () => {
  let getPhotographer = new MockService();
  let mockCommonDependency = new MockCommonDependency();
  let mockPhotographerProfileService = new MockService();

  mockPhotographerProfileService.serviceName = 'PhotographerProfileService';
  mockPhotographerProfileService.getMethod = 'getPhotographerProfile';
  mockPhotographerProfileService.fakeResponse = profile;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockPhotographerProfileService.getProviders()
    ]);
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(PhotographerProfileComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it(' ngOnInit, ngOnDestroy', ()=> {
    context.getPhotographer = getPhotographer;

    spyOn(context.getPhotographer, 'emit');

    context.ngOnInit();

    expect(context.photographer).toEqual(profile.data);
    expect(context.getPhotographer.emit).toHaveBeenCalledWith(`<span class="sub-title">Photographer:</span> ${context.photographer.firstName} ${context.photographer.lastName}`);
    spyOn(context.photographerProfileServiceSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.photographerProfileServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('isShowInfoMore', ()=> {
    let photographer: any = {company: 'company'};
    expect(context.isShowInfoMore(photographer)).toEqual('company');
    photographer = {description: 'description'};
    expect(context.isShowInfoMore(photographer)).toEqual('description');
    photographer = {google: 'google'};
    expect(context.isShowInfoMore(photographer)).toEqual('google');
    photographer = {facebook: 'facebook'};
    expect(context.isShowInfoMore(photographer)).toEqual('facebook');
    photographer = {twitter: 'twitter'};
    expect(context.isShowInfoMore(photographer)).toEqual('twitter');
    photographer = {linkedIn: 'linkedIn'};
    expect(context.isShowInfoMore(photographer)).toEqual('linkedIn');
  });
});
