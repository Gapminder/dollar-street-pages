import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscriber } from 'rxjs/Rx';
import {
  ContenfulContent,
  ContentfulTagPage,
  ContentfulNodePage,
  ContentfulImageDirective
} from 'ng2-contentful-blog/index';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let _ = require('lodash');

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'article-page',
  template: tpl,
  styles: [style],
  directives: [
    ContentfulImageDirective,
    HeaderWithoutSearchComponent,
    FooterComponent,
    LoaderComponent,
    FooterSpaceDirective,
    ROUTER_DIRECTIVES
  ]
})

export class BlogComponent implements OnInit, OnDestroy {
  protected posts: any[] = [];
  protected loader: boolean = false;
  private contentfulContentService: any;
  private contentfulContentServiceSubscribe: Subscriber<any>;

  public constructor(@Inject(ContenfulContent) contenfulContent: ContenfulContent) {
    this.contentfulContentService = contenfulContent;
  }

  public ngOnInit(): void {
    this.contentfulContentServiceSubscribe = this.contentfulContentService
      .getTagsBySlug('dollarstreet')
      .map((tags: ContentfulTagPage[]) => _.map(tags, 'sys.id'))
      .mergeMap((tagSysIds: any) => this.contentfulContentService.getArticlesByTag(tagSysIds))
      .subscribe((articles: ContentfulNodePage[]) => {
        this.posts = articles;
        this.loader = true;
      });
  }

  public ngOnDestroy(): void {
    this.contentfulContentServiceSubscribe.unsubscribe();
  }
}
