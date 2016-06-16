import {
  it,
  describe,
  async,
  inject,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../../app/common-mocks/mock.service.template';
import {profile} from '../mocks/data.ts';

import {PhotographerProfileComponent} from '../../../../app/photographer/photographer-profile/photographer-profile.component';

describe('PhotographerProfileComponent', () => {
  let mockPhotographerProfileService = new MockService();
  mockPhotographerProfileService.serviceName = 'PhotographerProfileService';
  mockPhotographerProfileService.getMethod = 'getPhotographerProfile';
  mockPhotographerProfileService.fakeResponse = profile;
  let getPhotographer = new MockService();
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockPhotographerProfileService.getProviders()
    ];
  });
  let context, fixture, nativeElement;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(PhotographerProfileComponent).then((fixtureInst:any) => {
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
    expect(context.getPhotographer.emit).toHaveBeenCalledWith(`Photographer: ${context.photographer.firstName} ${context.photographer.lastName}`);
    spyOn(context.photographerProfileServiceSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.photographerProfileServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
  it('isShowInfoMore', ()=> {
    let photographer:any = {company: 'company'};
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
  it('isShowDescription', ()=> {
    let company:any = {name: 'name'};
    expect(context.isShowDescription(company)).toEqual('name');
    company = {link: 'link'};
    expect(context.isShowDescription(company)).toEqual('link');
  });
});
