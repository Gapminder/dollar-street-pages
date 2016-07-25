import { it, describe, inject, async, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MockService } from '../../../app/common-mocks/mock.service.template';
import { res } from './mocks/data.ts';
import { HeaderWithoutSearchComponent } from '../../../../app/common/headerWithoutSearch/header.component';

describe('HeaderWithoutSearchComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  let mockHeaderService = new MockService();
  mockHeaderService.serviceName = 'HeaderService';
  mockHeaderService.getMethod = 'getDefaultThing';
  mockHeaderService.fakeResponse = {err: false, data: res.data};
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockHeaderService.getProviders()
    ];
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb
      .createAsync(HeaderWithoutSearchComponent)
      .then((fixtureInst:any) => {
        fixture = fixtureInst;
        context = fixture.debugElement.componentInstance;
      });
  })));
  it('ngOnInit', () => {
    context.ngOnInit();
    expect(context.defaultThing).toEqual(res.data);
    spyOn(context.headerServiceSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.headerServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
