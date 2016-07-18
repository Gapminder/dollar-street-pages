import { it, describe, inject, async, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { LoaderComponent } from '../../../../app/common/loader/loader.component';

describe('LoaderComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders()
    ];
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(LoaderComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('LoaderComponent must init', ()=> {
    fixture.detectChanges();
    expect(context.top).toBe(0);
  });
});
