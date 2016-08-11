import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';
import { Subscription } from 'rxjs/Rx';
import { FloatFooterComponent } from '../common/footer-floating/footer-floating.component';

let tpl = require('./article.template.html');
let style = require('./article.css');

@Component({
  selector: 'article-page',
  template: tpl,
  styles: [style],
  directives: [
    HeaderWithoutSearchComponent,
    FooterComponent,
    LoaderComponent,
    FooterSpaceDirective,
    FloatFooterComponent
  ]
})

export class ArticleComponent implements OnInit, OnDestroy {
  protected title: string;
  protected loader: boolean = false;
  private articleService: any;
  private articleServiceSubscribe: Subscription;
  private article: any;
  private thingId: string;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: Subscription;

  public constructor(@Inject('ArticleService') articleService: any,
                     @Inject(ActivatedRoute) activatedRoute: ActivatedRoute) {
    this.articleService = articleService;
    this.activatedRoute = activatedRoute;
  }

  public ngOnInit(): void {
    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.thingId = params.id;
      });

    this.articleServiceSubscribe = this.articleService
      .getArticle(`id=${this.thingId}`)
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.article = val.data;
        this.loader = true;
        this.title = 'Article about: ' + this.article.thing;
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
    this.articleServiceSubscribe.unsubscribe();
  }
}
