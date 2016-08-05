import { Component } from '@angular/core';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { PhotographersComponent } from './photographers/photographers.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./all-photographers.template.html');
let style = require('./all-photographers.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, PhotographersComponent, FooterComponent, FooterSpaceDirective]
})

export class AllPhotographersComponent {
  protected title: string = 'Photographers';
}
