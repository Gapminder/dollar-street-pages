import { it, describe, async, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { InfoComponent } from '../../../app/info/info.component';

describe('InfoComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();

    return [mockCommonDependency.getProviders()];
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(InfoComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('InfoComponent must init ', () => {
    context.title = 'Info';
  });
});
