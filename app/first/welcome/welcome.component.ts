import {Component} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

let tpl = require('./welcome.template.html');
let style = require('./welcome.css');

@Component({
  selector: 'welcome',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class WelcomeComponent {

}
