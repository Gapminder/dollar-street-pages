import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { HeaderWithoutFiltersComponent } from '../../../../src/shared/header-without-filters/header.component';

describe('HeaderWithoutFiltersComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb
      .createAsync(HeaderWithoutFiltersComponent)
      .then((fixtureInst: any) => {
        fixture = fixtureInst;
        context = fixture.debugElement.componentInstance;
      });
  })));

  it('ngOnInit', () => {
    context.ngOnInit();

    spyOn(context.titleHeaderSubscribe, 'unsubscribe');
    spyOn(context.headerServiceSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.titleHeaderSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.headerServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
