import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, UrlPathWithParams, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {
  ContenfulContent,
  ContentfulTagPage,
  ContentfulNodePage,
  NodePageContent,
  RoutesManagerService,
  ToDatePipe,
  EntriesViewComponent,
  RelatedComponent,
  TagsComponent,
  ContributorsComponent
} from 'ng2-contentful-blog/index';
import { RawRoute } from 'ng2-contentful-blog/components/routes-gateway/routes-manager.service';
import { LoaderComponent } from '../common/loader/loader.component';
import * as _ from 'lodash';

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'blog-page',
  template: tpl,
  styles: [style],
  directives: [
    EntriesViewComponent,
    RelatedComponent,
    ROUTER_DIRECTIVES,
    TagsComponent,
    ContributorsComponent,
    LoaderComponent
  ],
  pipes: [ToDatePipe]
})

export class BlogComponent implements OnInit {
  private loader: boolean = true;
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
  private titleHeaderService: any;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent,
                     @Inject('Constants') constants: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
    this.router = router;
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
    this.activatedRoute = activatedRoute;
    this.constants = constants;

    let snapshotUrl: any = this.activatedRoute.snapshot.url;
    this.isArticle = snapshotUrl.length > 1 && (snapshotUrl[0].path === 'blog' || snapshotUrl[0].path === 'answers' || snapshotUrl[0].path === 'videos');
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.titleHeaderService.setTitle('Blog');

    this.activatedRoute.url
      .subscribe((urls: UrlPathWithParams[]) => {
        this.urlPath = urls.map((value: UrlPathWithParams) => value.path).join('/');
        this.contentSlug = this.urlPath.split('/').pop();

        this.contentfulContentService
          .getTagsBySlug(this.constants.PROJECT_TAG)
          .mergeMap((tags: ContentfulTagPage[]) => Observable.from(tags))
          .map((tag: ContentfulTagPage) => tag.sys.id)
          .mergeMap((tagSysId: string) => this.contentfulContentService.getArticleByTagAndSlug(tagSysId, this.contentSlug))
          .mergeMap((articles: ContentfulNodePage[]) => Observable.from(articles))
          .subscribe((article: ContentfulNodePage) => this.onArticleReceived(article));
      });
  }

  private onArticleReceived(article: ContentfulNodePage): void {
    if (!article) {
      this.router.navigate(['/blog']);
    }

    this.content = article.fields;

    this.contentfulContentService.getChildrenOfArticle(article.sys.id)
      .do((articles: ContentfulNodePage[]) => this.addRoutes(articles))
      .subscribe((children: ContentfulNodePage[]) => {
        this.children = children;
        this.loader = false;
      });
  }

  private addRoutes(articles: ContentfulNodePage[]): void {
    const rawRoutes: RawRoute[] = [];
    _.forEach(articles, (contentfulArticle: ContentfulNodePage) => {
      const article: NodePageContent = contentfulArticle.fields;
      rawRoutes.push({path: article.slug, data: {name: article.title}});
    });

    this.routesManager.addRoutes(rawRoutes);
  }
}
