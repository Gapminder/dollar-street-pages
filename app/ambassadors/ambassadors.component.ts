import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { AmbassadorsListComponent } from './ambassadors-list/ambassadors-list.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./ambassadors.template.html');
let style = require('./ambassadors.css');

@Component({
  selector: 'ambassadors',
  template: tpl,
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, AmbassadorsListComponent, FooterComponent, FooterSpaceDirective]
})

export class AmbassadorsComponent {
  private title:string;

  public constructor() {
    this.title = 'Ambassadors';
  }
}
