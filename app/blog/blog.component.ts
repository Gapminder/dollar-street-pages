import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {FooterComponent} from '../common/footer/footer.component';
import {LoaderComponent} from '../common/loader/loader.component';

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'blog-page',
  template: tpl,
  styles: [style],
  directives: [RouterLink, HeaderWithoutSearchComponent, FooterComponent, LoaderComponent]
})

export class BlogComponent implements OnInit, OnDestroy {
  public title:string = 'Blog';
  private blogService:any;
  private blogServiceSubscribe:any;
  private articles:any;

  public constructor(@Inject('BlogService') blogService:any) {
    this.blogService = blogService;
  }

  public ngOnInit():void {
    this.blogServiceSubscribe = this.blogService
      .getArticles()
      .subscribe((val:any) => {
        if (val.err) {
          console.log(val.err);
          return;
        }

        this.articles = val.data;
      });
  }

  public ngOnDestroy():void {
    this.blogServiceSubscribe.unsubscribe();
  }
}
