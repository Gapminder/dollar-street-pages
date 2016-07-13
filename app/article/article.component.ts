import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';

let tpl = require('./article.template.html');
let style = require('./article.css');

@Component({
  selector: 'article-page',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, FooterComponent, LoaderComponent]
})

export class ArticleComponent implements OnInit, OnDestroy {
  public title:string;
  public loader:boolean = false;
  private articleService:any;
  private articleServiceSubscribe:any;
  private article:any;
  private thingId:string;
  private routeParams:RouteParams;

  public constructor(@Inject('ArticleService') articleService:any, @Inject(RouteParams) routeParams:RouteParams) {
    this.articleService = articleService;
    this.routeParams = routeParams;
  }

  public ngOnInit():void {
    this.thingId = this.routeParams.get('id');

    this.articleServiceSubscribe = this.articleService
      .getArticle(`id=${this.thingId}`)
      .subscribe((val:any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.article = val.data;
        this.loader = true;
        this.title = 'Article about: ' + this.article.thing;
      });
  }

  public ngOnDestroy():void {
    this.articleServiceSubscribe.unsubscribe();
  }
}
