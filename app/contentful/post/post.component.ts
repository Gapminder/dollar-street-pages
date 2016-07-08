import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouteParams } from '@angular/router-deprecated';
import { HeaderWithoutSearchComponent } from '../../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { LoaderComponent } from '../../common/loader/loader.component';
import { ContentfulImageDirective } from '../contentful-image.directive';
import { EntriesViewComponent } from '../entries-view/entries-view.component';
import { ToDatePipe } from '../pipes/to-date.pipe';

let tpl = require('./post.template.html');
let style = require('./post.css');

@Component({
  selector: 'post-page',
  template: tpl,
  styles: [style],
  directives: [EntriesViewComponent, ContentfulImageDirective, RouterLink, HeaderWithoutSearchComponent, FooterComponent, LoaderComponent],
  pipes: [ToDatePipe]
})

export class PostComponent implements OnInit, OnDestroy {
  public title:string = 'Blog';
  public post:any;
  public loader:boolean = false;
  private contentfulService:any;
  private contentfulServiceSubscribe:any;
  private routeParams:RouteParams;
  private postId:string;

  public constructor(@Inject('ContenfulContent') contentfulService:any,
                     @Inject(RouteParams) routeParams:RouteParams) {
    this.contentfulService = contentfulService;
    this.routeParams = routeParams;
  }

  public ngOnInit():void {
    this.postId = this.routeParams.get('slug');

    this.contentfulServiceSubscribe = this.contentfulService
      .getNodePage(this.postId)
      .subscribe((post:any) => {
        this.post = post[0].fields;
        this.loader = true;
      });
  }

  public ngOnDestroy():void {
    this.contentfulServiceSubscribe.unsubscribe();
  }
}
