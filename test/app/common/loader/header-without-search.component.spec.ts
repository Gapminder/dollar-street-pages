import {
  it,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {LoaderComponent} from '../../../../app/common/loader/loader.component';

describe('LoaderComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders()
    ];
  });
  it('LoaderComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(LoaderComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.top).toBe(0);
    });
  }));
});
