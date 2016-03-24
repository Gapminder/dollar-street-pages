import {Component, Inject} from 'angular2/core';
import {RouteParams, RouterLink} from 'angular2/router';

import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./sitemap.template.html');
let style = require('./sitemap.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [RouterLink, HeaderWithoutSearchComponent, FooterComponent]
})

export class SitemapComponent {
  private title:string = 'Sitemap';
  private routeParams:RouteParams;

  constructor(@Inject(RouteParams) routeParams) {
    this.routeParams = routeParams;
  }

}
