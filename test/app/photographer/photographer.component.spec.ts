import { it, describe, inject, async, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { PhotographerComponent } from '../../../app/photographer/photographer.component';

describe('PhotographerComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });

  let fixture;
  let context;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb
      .overrideTemplate(PhotographerComponent, '<div></div>')
      .createAsync(PhotographerComponent).then((fixtureInst:any) => {
        fixture = fixtureInst;
        context = fixtureInst.debugElement.componentInstance;
        context.routeParams.set('id', '5477537786deda0b00d43be5');
      });
  })));

  it('PhotographerComponent must init', () => {
    context.ngOnInit();
    expect(context.photographerId).toEqual('5477537786deda0b00d43be5');
  });
});
