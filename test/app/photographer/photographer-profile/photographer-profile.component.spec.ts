import {
  it,
  xit,
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
  it('PhotographerProfileComponent must init ', ()=> {
    fixture.detectChanges();
    expect(context.photographer.imagesCount).toBe(289);
    expect(context.photographer.placesCount).toBe(4);
    mockPhotographerProfileService.toInitState();
  });
  it('PhotographerProfileComponent must destroy ', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockPhotographerProfileService.countOfSubscribes).toBe(0);
  });
  xit('PhotographerProfileComponent must show on mobile ', ()=> {
    /**
     * ToDo: create some cases for
     * checking mobile rendering
     */
  });
  it('PhotographerProfileComponent must render photographer info', ()=> {
    fixture.detectChanges();
    let photographerName = nativeElement.querySelector('let photographer-profile .header h2');
    let photographerPhotos = nativeElement.querySelector('let photographer-profile .main .photo span');
    expect(photographerName.innerHTML).toBe('AJ Sharma');
    expect(photographerPhotos.innerHTML).toBe('289');
    fixture.detectChanges();
    photographerName = nativeElement.querySelector('let photographer-profile .header h2');
    photographerPhotos = nativeElement.querySelector('let photographer-profile .main .photo span');
    expect(photographerName.innerHTML).toBe('AJ Sharma');
    expect(photographerPhotos.innerHTML).toBe('289');
  });
});
