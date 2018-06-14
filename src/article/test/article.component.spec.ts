import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MockComponent } from 'ng2-mock-component';

import { LanguageService, LoaderService } from '../../common';
import { LanguageServiceMock } from '../../test/';
import { ArticleComponent } from '../article.component';
import { ArticleService } from '../article.service';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArticleComponent Test', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let articleService: ArticleServiceMock;
  let languageService: LanguageServiceMock;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonServicesTestingModule
      ],
      declarations: [
        ArticleComponent,
        MockComponent({ selector: 'translate-me' })
      ],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: ArticleService, useClass: ArticleServiceMock }
      ]
    });

    articleService = TestBed.get(ArticleService);
    languageService = TestBed.get(LanguageService);
    loaderService = TestBed.get(LoaderService);
    fixture = TestBed.createComponent(ArticleComponent);

    component = fixture.componentInstance;
  });

  it('check subscriptions on init', () => {
    fixture.detectChanges();

    expect(component.queryParamsSubscribe).toBeDefined();
    expect(component.articleServiceSubscribe).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    fixture.detectChanges();

    spyOn(component.queryParamsSubscribe, 'unsubscribe');
    spyOn(component.articleServiceSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.articleServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('show translate-me component when article not translated', () => {
    const data = {
      thing: 'expected thing',
      description: 'expected description',
      translated: false
    };
    spyOn(articleService, 'getArticle').and.returnValue(Observable.of({ err: null, data, success: true }));
    languageService.currentLanguage = 'ru';
    languageService.defaultLanguage = 'en';
    fixture.detectChanges();

    const translateMeBlock = fixture.debugElement.query(By.css('translate-me'));

    expect(translateMeBlock).toBeTruthy();
  });

  it('do not show translate-me when article translated', () => {
    const data = {
      thing: 'expected thing',
      description: 'expected description',
      translated: true
    };
    spyOn(articleService, 'getArticle').and.returnValue(Observable.of({ err: null, data, success: true }));
    languageService.currentLanguage = 'ru';
    languageService.defaultLanguage = 'en';
    fixture.detectChanges();

    const translateMeBlock = fixture.debugElement.query(By.css('translate-me'));

    expect(translateMeBlock).toBeFalsy();
  });

  it('replace links to gapminder.org with links to current host in article description', () => {
    const data = {
      thing: 'expected thing',
      description: 'http://gapminder.org/linkToPage expected description. https://gapminder.org/linkToPage replaced'
    };
    spyOn(articleService, 'getArticle').and.returnValue(Observable.of({ err: null, data, success: true }));
    const locationHost = component.window.location.host;

    fixture.detectChanges();

    expect(component.article.description).toEqual(`http://${locationHost}/linkToPage expected description. https://${locationHost}/linkToPage replaced`);
  });

  it('get article by thingId', () => {
    spyOn(articleService, 'getArticle').and.callThrough();
    spyOn(languageService, 'getLanguageParam').and.returnValue('&lang=en');
    fixture.detectChanges();

    expect(articleService.getArticle).toHaveBeenCalledWith(`id=${expectedId}&lang=en`);
  });
});


class ArticleServiceMock {
  public getArticle(): Observable<any> {
    return Observable.of({ err: null, data: { thing: 'df', description: 'expected description' } })
  }
};

const expectedId = 'expectedId';
const ActivatedRouteStub = {
  params: Observable.of({ 'id': expectedId })
};
