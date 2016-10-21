import { Component } from '@angular/core';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header-first',
  template: tpl,
  styles: [style]
})

export class HeaderFirstComponent {
}
