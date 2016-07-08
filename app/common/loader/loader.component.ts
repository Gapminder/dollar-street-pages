import { Component, OnInit } from '@angular/core';

let tpl = require('./loader.template.html');
let style = require('./loader.css');

@Component({
  selector: 'loader',
  template: tpl,
  styles: [style]
})

export class LoaderComponent implements OnInit {
  private top:number = 0;

  public ngOnInit():void {
    let header = document.querySelector('.main-header');
    let onboardingHeight = document.querySelector('.matrix-onboard');

    if (header) {
      this.top = header.clientHeight;

      if (onboardingHeight) {
        this.top = this.top - onboardingHeight.clientHeight;
      }
    }
  }
}
