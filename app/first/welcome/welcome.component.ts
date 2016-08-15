import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

let tpl = require('./welcome.template.html');
let style = require('./welcome.css');

@Component({
  selector: 'welcome',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES]
})

export class WelcomeComponent {

}
