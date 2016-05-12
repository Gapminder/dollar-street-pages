import {
  it,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../../app/common-mocks/mock.service.template';
import {res} from './mocks/data.ts';

import {HeaderWithoutSearchComponent} from '../../../../app/common/headerWithoutSearch/header.component';

describe('HeaderWithoutSearchComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  let mockHeaderService = new MockService();
  mockHeaderService.serviceName = 'HeaderService';
  mockHeaderService.getMethod = 'getDefaultThing';
  mockHeaderService.fakeResponse = {err: null, data: res.data};
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockHeaderService.getProviders()
    ];
  });
  let context, fixture;
  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(HeaderWithoutSearchComponent)
      .then((fixtureInst) => {
        fixture = fixtureInst;
        context = fixture.debugElement.componentInstance;
      });
  }));
  it('ngOnInit', () => {
    context.ngOnInit();
    expect(context.defaultThing).toEqual(res.data);
    spyOn(context.headerServiceSibscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.headerServiceSibscribe.unsubscribe).toHaveBeenCalled();
  });
});
