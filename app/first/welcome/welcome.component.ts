import { Component } from '@angular/core';

let tpl = require('./welcome.template.html');
let style = require('./welcome.css');

@Component({
  selector: 'welcome',
  template: tpl,
  styles: [style]
})

export class WelcomeComponent {

}
