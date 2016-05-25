import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {HeaderWithoutSearchComponent} from '../../common/headerWithoutSearch/header.component';
import {FooterComponent} from '../../common/footer/footer.component';
import {LoaderComponent} from '../../common/loader/loader.component';
import {ContentfulImageDirective} from '../contentful-image.directive';
import {ToDatePipe} from '../pipes/to-date.pipe';

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'blog-page',
  template: tpl,
  styles: [style],
  directives: [ContentfulImageDirective, RouterLink, HeaderWithoutSearchComponent, FooterComponent, LoaderComponent],
  pipes: [ToDatePipe]
})

export class BlogComponent implements OnInit, OnDestroy {
  public title:string = 'Blog';
  public posts:any;
  public loader:boolean = false;
  private contentfulService:any;
  private contentfulServiceSubscribe:any;

  public constructor(@Inject('ContenfulContent') contentfulService:any) {
    this.contentfulService = contentfulService;
  }

  public ngOnInit():void {
    this.contentfulServiceSubscribe = this.contentfulService
      .getPosts()
      .subscribe((posts:any) => {
        this.posts = posts;
        this.loader = true;
      });
  }

  public ngOnDestroy():void {
    this.contentfulServiceSubscribe.unsubscribe();
  }
}
