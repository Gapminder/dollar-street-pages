import {
  it,
  xit,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services';
import {PhotographerComponent} from '../../../app/photographer/photographer.component';


describe('PhotographerComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  let fixture, context;
  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideTemplate(PhotographerComponent, '<div></div>')
      .createAsync(PhotographerComponent).then((fixtureInst) => {
        fixture = fixtureInst;
        context = fixtureInst.debugElement.componentInstance;
        context.routeParams.set('id', '5477537786deda0b00d43be5');
      });
  }))
  it('PhotographerComponent must init', () => {
    expect(context.title).toEqual('Photographer');
    context.ngOnInit();
    expect(context.photographerId).toEqual('5477537786deda0b00d43be5');
  });
});
