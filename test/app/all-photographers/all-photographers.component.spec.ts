/**
 * Created by igor on 3/30/16.
 */
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

import {MockCommonDependency} from '../../app/common-mocks/mocked.services';
import {AllPhotographersComponent} from '../../../app/all-photographers/all-photographers.component';

describe('PhotographersComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  let context, fixture;
  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AllPhotographersComponent).then((fixtureInst) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  }));
  it('AllPhotographersComponent must init ', () => {
    context.title = 'Photographers';
  });
});
