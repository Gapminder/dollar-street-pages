import { Component } from '@angular/core';

let tpl = require('./first.template.html');
let style = require('./first.css');

@Component({
  selector: 'first-page',
  template: tpl,
  styles: [style]
})

// export class FirstComponent {}
