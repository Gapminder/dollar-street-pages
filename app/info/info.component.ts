import { Component } from '@angular/core';
import { InfoContextComponent } from './info-context/info-context.component';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FloatFooterComponent } from '../common/footer-floating/footer-floating.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./info.template.html');
let style = require('./info.css');

@Component({
  selector: 'info-page',
  template: tpl,
  styles: [style],
  directives: [
    HeaderWithoutSearchComponent,
    InfoContextComponent,
    FooterComponent,
    FloatFooterComponent,
    LoaderComponent,
    FooterSpaceDirective]
})

export class InfoComponent {
  protected title: string = 'Info';
}
