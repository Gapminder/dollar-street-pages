/**
 * Created by igor on 3/30/16.
 */
import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services'
import {AllPhotographersComponent} from '../../../app/all-photographers/all-photographers.component';

describe('PhotographersComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  it('AllPhotographersComponent must init ', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AllPhotographersComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      let nativeElement = fixture.debugElement.nativeElement;
      expect(nativeElement.querySelector('.heading').innerHTML).toEqual(context.title);
    });
  }));
});
