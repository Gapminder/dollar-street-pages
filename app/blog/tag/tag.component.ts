import { Component } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { TagComponent, ContenfulContent, BreadcrumbsService, ToDatePipe } from 'ng2-contentful-blog';
import { HeaderWithoutSearchComponent } from '../../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { FloatFooterComponent } from '../../common/footer-floating/footer-floating.component';
import { LoaderComponent } from '../../common/loader/loader.component';
import { FooterSpaceDirective } from '../../common/footer-space/footer-space.directive';

let tpl = require('./tag.template.html');
let style = require('./tag.css');

@Component({
  selector: 'gm-tagged-articles',
  template: tpl as string,
  directives: [
    ROUTER_DIRECTIVES,
    HeaderWithoutSearchComponent,
    FooterComponent,
    FloatFooterComponent,
    LoaderComponent,
    FooterSpaceDirective
  ],
  styles: [style as string],
  pipes: [ToDatePipe]
})

export class ArticleTagComponent extends TagComponent {
  protected title: string = 'Blog';

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService) {
    super(router, activatedRoute, contentfulContentService, breadcrumbsService);
    this.ngOnInit();
  }
}
