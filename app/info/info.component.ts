import {Component} from '@angular/core';

import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {InfoContextComponent} from './info-context/info-context.component';
import {FooterComponent} from '../common/footer/footer.component';
import {LoaderComponent} from '../common/loader/loader.component';

let tpl = require('./info.template.html');
let style = require('./info.css');

@Component({
  selector: 'info-page',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, InfoContextComponent, FooterComponent, LoaderComponent]
})

export class InfoComponent {
}
