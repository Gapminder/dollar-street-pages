import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { LoaderComponent } from '../../../../app/common/loader/loader.component';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(LoaderComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('must init', () => {
    fixture.detectChanges();
    expect(context.top).toBe(0);
  });
});
