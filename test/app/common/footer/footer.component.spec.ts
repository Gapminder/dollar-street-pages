import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {FooterComponent} from '../../../../app/common/footer/footer.component';


describe('FooterComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  it('FooterComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(FooterComponent).then((fixture) => {
      fixture.detectChanges();
      let nativeElement = fixture.debugElement.nativeElement;
      expect(nativeElement.querySelector('.footer .logo_name').innerHTML).toEqual('Dollar Street');
    });
  }));
});
