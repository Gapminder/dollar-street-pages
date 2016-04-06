import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
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
  mockHeaderService.fakeResponse = res;
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockHeaderService.getProviders()
    ];
  });
  it('HeaderWithoutSearchComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(HeaderWithoutSearchComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.defaultThing.name).toBe('Home');
      expect(context.defaultThing.plural).toBe('Homes');
      mockHeaderService.toInitState();
    });
  }));
  it('HeaderWithoutSearchComponent must destroy', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(HeaderWithoutSearchComponent).then((fixture) => {
      fixture.detectChanges();
      fixture.destroy();
      expect(mockHeaderService.countOfSubscribes).toBe(0);
    });
  }));
});
