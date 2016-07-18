import { it, describe, async, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { AllPhotographersComponent } from '../../../app/all-photographers/all-photographers.component';

describe('PhotographersComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(AllPhotographersComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('AllPhotographersComponent must init ', () => {
    context.title = 'Photographers';
  });
});
