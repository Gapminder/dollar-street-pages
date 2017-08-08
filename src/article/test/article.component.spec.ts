import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
  LoaderService,
  TitleHeaderService,
  LanguageService
} from '../../common';
import {
  LoaderServiceMock,
  LanguageServiceMock,
  TitleHeaderServiceMock
} from '../../test/';
import { SharedModule } from '../../shared';
import { ArticleComponent } from '../article.component';
import { ArticleService } from '../article.service';

describe('ArticleComponent Test', () => {
  let componentInstance: ArticleComponent;
  let componentFixture: ComponentFixture<ArticleComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  class ArticleServiceMock {
    public getArticle(): void {
      return;
    }
  };

  const ActivatedRouteStub = {
    params: Observable.of({'id': 1})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, SharedModule ],
      declarations: [ ArticleComponent ],
      providers: [
          { provide: ActivatedRoute, useValue: ActivatedRouteStub },
          { provide: ArticleService, useClass: ArticleServiceMock },
          { provide: LoaderService, useClass: LoaderServiceMock },
          { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
          { provide: LanguageService, useClass: LanguageServiceMock }
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
