import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { PhotographerComponent } from '../../../src/photographer/photographer.component';

describe('PhotographerComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let fixture;
  let context;

  beforeEach(async(inject([TestComponentBuilder, ActivatedRoute],
    (tcb: TestComponentBuilder, activatedRoute: ActivatedRoute) => {
      return tcb
        .overrideTemplate(PhotographerComponent, '<div></div>')
        .createAsync(PhotographerComponent).then((fixtureInst: any) => {
          fixture = fixtureInst;
          context = fixtureInst.debugElement.componentInstance;
          activatedRoute.params = Observable.of({id: '5477537786deda0b00d43be5'});
        });
    })));

  it('PhotographerComponent must init', () => {
    context.ngOnInit();
    expect(context.photographerId).toEqual('5477537786deda0b00d43be5');
  });
});
