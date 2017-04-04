import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { LoaderService, TitleHeaderService, LanguageService } from '../../common';

import { ArticleComponent } from '../article.component';
import { ArticleService } from '../article.service';

describe('ArticleComponent Test', () => {
  let componentInstance: ArticleComponent;
  let componentFixture: ComponentFixture<ArticleComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  const userArticleService = {
    getArticle: () => {
      return;
    }
  };

  const userLoaderService = {
    setLoader: (b: boolean) => {
      return b;
    }
  };

  const userTitleHeaderService = {

  };

  const userLanguageService = {
    getLanguageParam: () => {
      return;
    }
  };

  const userActivatedRoute = {
    params: Observable.of({'id': 1})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ ArticleComponent ],
      providers: [
                     { provide: ActivatedRoute, useValue: userActivatedRoute },
                     { provide: ArticleService, useValue: userArticleService },
                     { provide: LoaderService, useValue: userLoaderService },
                     { provide: TitleHeaderService, useValue: userTitleHeaderService },
                     { provide: LanguageService, useValue: userLanguageService }
                 ]
    });

    componentFixture = TestBed.createComponent(ArticleComponent);

    TestBed.compileComponents();

    componentInstance = componentFixture.componentInstance;
    debugElement = componentFixture.debugElement.query(By.css('div'));
    nativeElement = debugElement.nativeElement;
  }));

  it('ArticleComponent: ID', () => {
    expect(nativeElement.getAttribute('id')).toEqual('article-content');
  });
});
