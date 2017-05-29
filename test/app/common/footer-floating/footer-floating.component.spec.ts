import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { FloatFooterComponent } from '../../../../src/shared/float-footer/float-footer.component';

describe('FloatFooterComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(FloatFooterComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.scrollSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.scrollSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
