import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';

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
