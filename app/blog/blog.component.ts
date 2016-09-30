import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {
  ContenfulContent,
  ContentfulTagPage,
  ContentfulNodePage,
  NodePageContent,
  RoutesManagerService
} from 'ng2-contentful-blog/index';
import * as _ from 'lodash';
import { LoaderService } from '../common/loader/loader.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'blog-page',
  template: tpl,
  styles: [style]
})

export class BlogComponent implements OnInit, OnDestroy {
  private isArticle: boolean;
  private content: NodePageContent;
  private children: ContentfulNodePage[];
  private urlPath: string;
  private contentSlug: string;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;
  private constants: any;
  private loaderService: LoaderService;
  private titleHeaderService: TitleHeaderService;
  private projectTagId: string;
  private relatedArticles: ContentfulNodePage[];

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     @Inject('Constants') constants: any) {
    this.router = router;
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
    this.activatedRoute = activatedRoute;
    this.constants = constants;
    this.loaderService = loaderService;

    let snapshotUrl: any = this.activatedRoute.snapshot.url;
    this.isArticle = snapshotUrl.length > 1 && (snapshotUrl[0].path === 'blog' || snapshotUrl[0].path === 'answers' || snapshotUrl[0].path === 'videos');
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);
    this.titleHeaderService.setTitle('Blog');

    this.activatedRoute.url
      .subscribe((urls: UrlSegment[]) => {
        this.urlPath = urls.map((value: UrlSegment) => value.path).join('/');
        this.contentSlug = this.urlPath.split('/').pop();

        this.contentfulContentService
          .getTagsBySlug(this.constants.PROJECT_TAG)
          .mergeMap((tags: ContentfulTagPage[]) => Observable.from(tags))
          .do((projectTagId: ContentfulTagPage)=> this.projectTagId = projectTagId.sys.id)
          .map((tag: ContentfulTagPage) => tag.sys.id)
          .mergeMap((tagSysId: string) => this.contentfulContentService.getArticleByTagAndSlug(tagSysId, this.contentSlug))
          .mergeMap((articles: ContentfulNodePage[]) => Observable.from(articles))
          .subscribe((article: ContentfulNodePage) => this.onArticleReceived(article));
      });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);
  }

  private related(related: ContentfulNodePage[]): Observable<ContentfulNodePage[]> {
    return Observable
      .from(related)
      .filter((article: ContentfulNodePage) => !!_.find(article.fields.tags, (tag: ContentfulTagPage) => tag.sys.id === this.projectTagId))
      .toArray();
  }

  private onArticleReceived(article: ContentfulNodePage): void {
    if (!article) {
      this.router.navigate(['/blog']);
    }

    this.content = article.fields;

    if (this.content.related) {
      this.related(this.content.related).subscribe((related: ContentfulNodePage[]) => {
        if (!_.isEmpty(related)) {
          this.relatedArticles = related;
        }
      });
    }

    this.contentfulContentService.getChildrenOfArticleByTag(article.sys.id, this.constants.PROJECT_TAG)
      .subscribe((children: ContentfulNodePage[]) => {
        _.forEach(children, (child: ContentfulNodePage) => {
          const currentPagePath: string = _.map(this.activatedRoute.snapshot.url, 'path').join('/');
          child.fields.url = `${currentPagePath}/${child.fields.slug}`;
        });
        this.routesManager.addRoutesFromArticles(... children);
        this.children = children;

        this.loaderService.setLoader(true);
      });
  }
}
