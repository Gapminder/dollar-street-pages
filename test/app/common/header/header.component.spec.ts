import {
  it,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../../app/common-mocks/mock.service.template';
import {HeaderComponent} from '../../../../app/common/header/header.component';
import {HeaderService} from '../../../../app/common/header/header.service';
import {thing} from './mocks/data.ts';

describe('FooterComponent', () => {
  let headerService = new MockService();
  headerService.serviceName = 'HeaderService';
  headerService.getMethod = 'getDefaultThing';
  headerService.fakeResponse = {err: thing.error, data: thing.data};
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      headerService.getProviders(),
    ];
  });
  let fixture, context;
  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideTemplate(HeaderComponent, `<div></div>`)
        .createAsync(HeaderComponent)
        .then((componentFixture) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
        });
    }
  ));
  it('ngOnInit ngOnDestroy', () => {
    context.ngOnInit();
    expect(context.defaultThing).toEqual(thing.data);
    spyOn(context.headerServiceSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.headerServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
  it('urlTransfer', () => {
    spyOn(context.filter, 'emit');
    let url = 'http://example.com';
    context.urlTransfer(url);
    expect(context.filter.emit).toHaveBeenCalledWith(url);
  });
  it('activeThingTransfer', () => {
    let thing = {_id: '5477537786deda0b00d43be5', plural: 'Tools', name: 'Tool'};
    context.activeThingTransfer(thing);
    expect(context.activeThing).toEqual(thing);
  });
  it('goToMain', () => {
    spyOn(context.router, 'navigate');
    context.goToMain();
    expect(context.router.navigate).toHaveBeenCalledWith(['Main']);
  });
});
