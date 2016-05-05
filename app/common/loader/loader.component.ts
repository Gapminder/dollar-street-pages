import {Component, OnInit} from '@angular/core';

let tpl = require('./loader.template.html');
let style = require('./loader.css');

@Component({
  selector: 'loader',
  template: tpl,
  styles: [style]
})

export class LoaderComponent implements OnInit {
  private top:number = 0;

  ngOnInit() {
    let header = document.querySelector('.main-header');
    if (header) {
      this.top = header.clientHeight;
    }
  }
}
