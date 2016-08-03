import { it, describe, async, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { infoContext } from './mocks/data.ts';
import { InfoContextComponent } from '../../../../app/info/info-context/info-context.component';

describe('PhotographerPlacesComponent', () => {
  let mockInfoService = new MockService();
  mockInfoService.serviceName = 'InfoContextService';
  mockInfoService.getMethod = 'getInfo';
  mockInfoService.fakeResponse = infoContext;

  let mockCommonDependency = new MockCommonDependency();

  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockInfoService.getProviders()
    ];
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(InfoContextComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();
    expect(context.info).toEqual(infoContext.data);
    spyOn(context.infoContextServiceSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.infoContextServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
