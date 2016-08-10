import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { TeamListComponent } from './team-list/team-list.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FloatFooterComponent } from '../common/footer-floating/footer-floating.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./team.template.html');
let style = require('./team.css');

@Component({
  selector: 'team',
  template: tpl,
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  directives: [
    HeaderWithoutSearchComponent,
    TeamListComponent,
    FooterComponent,
    FloatFooterComponent,
    FooterSpaceDirective]
})

export class TeamComponent {
  protected title: string = 'Dollar Street Team';
}
