import {Component} from 'angular2/core';

import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {PhotographersComponent} from './photographers/photographers.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./all-photographers.template.html');
let style = require('./all-photographers.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, PhotographersComponent, FooterComponent]
})

export class AllPhotographersComponent {
  private title:string = 'Photographers';
}
