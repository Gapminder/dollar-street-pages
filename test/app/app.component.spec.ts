import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../app/common-mocks/mocked.services';
import { AppComponent } from '../../app/app.component';

describe('AppComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(AppComponent)
      .then((fixtureInst: any) => {
        fixture = fixtureInst;
        context = fixture.debugElement.componentInstance;
      });
  })));

  it('ngOnInit and ngOnDestroy', () => {
    expect(context.isLoaderd).toBe(false);

    context.ngOnInit();

    spyOn(context.routerEventsSubscribe, 'unsubscribe');
    spyOn(context.loaderServiceSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.loaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
