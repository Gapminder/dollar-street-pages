import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { CountryComponent } from '../../../src/country/country.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ArticleComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder, ActivatedRoute],
    (tcb: TestComponentBuilder, activatedRoute: ActivatedRoute) => {
      return tcb.createAsync(CountryComponent).then((fixtureInst: any) => {
        fixture = fixtureInst;
        context = fixture.debugElement.componentInstance;

        activatedRoute.params = Observable.of({id: '55ef338d0d2b3c8203788448'});
      });
    })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.queryParamsSubscribe, 'unsubscribe');
    expect(context.countryId).toEqual('55ef338d0d2b3c8203788448');

    context.ngOnDestroy();

    expect(context.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('setTitle', ()=> {
    spyOn(context, 'setTitle').and.callThrough();

    context.setTitle('Latvia');
    expect(context.setTitle).toHaveBeenCalledWith('Latvia');
  });
});
