import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { HeaderWithoutSearchComponent } from '../../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { LoaderComponent } from '../../common/loader/loader.component';
import { ContentfulImageDirective } from '../contentful-image.directive';
import { ToDatePipe } from '../pipes/to-date.pipe';
import { FooterSpaceDirective } from '../../common/footer-space/footer-space.directive';

let tpl = require('./blog.template.html');
let style = require('./blog.css');

@Component({
  selector: 'blog-page',
  template: tpl,
  styles: [style],
  directives: [ContentfulImageDirective, RouterLink, HeaderWithoutSearchComponent, FooterComponent, LoaderComponent, FooterSpaceDirective],
  pipes: [ToDatePipe]
})

export class BlogComponent implements OnInit {
  public title:string = 'Blog';
  public posts:any;
  public loader:boolean = false;
  private contentfulService:any;

  public constructor(@Inject('ContenfulContent') contentfulService:any) {
    this.contentfulService = contentfulService;
  }

  public ngOnInit():void {
    this.contentfulService
      .getPosts((posts:any) => {
        this.posts = posts;
        this.loader = true;
      });
  }
}
