import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { MockService } from '../../app/common-mocks/mock.service.template';
import { aboutContext } from './mocks/data.ts';
import { ArticleComponent } from '../../../app/article/article.component';

describe('ArticleComponent', () => {
  let mockArticleService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockArticleService.serviceName = 'ArticleService';
  mockArticleService.getMethod = 'getArticle';
  mockArticleService.fakeResponse = aboutContext;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockArticleService.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(ArticleComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.queryParamsSubscribe, 'unsubscribe');
    spyOn(context.articleServiceSubscribe, 'unsubscribe');

    expect(context.article).toEqual(aboutContext.data);
    expect(context.loader).toEqual(false);

    context.ngOnDestroy();
    expect(context.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.articleServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
