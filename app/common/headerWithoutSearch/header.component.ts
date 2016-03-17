import {Component, Inject, Input, OnInit} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {HeaderService} from '../header/header.service';
import {MainMenuComponent} from '../menu/menu.component';

let tpl = require('./header.component.html');
let style = require('./header.component.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent, RouterLink]
})

export class HeaderWithoutSearchComponent implements OnInit {
  @Input()
  private title:string;
  private defaultThing:any;
  private headerService:HeaderService;

  constructor(@Inject(HeaderService) headerService) {
    this.headerService = headerService;
  }

  ngOnInit():void {
    this.headerService.getDefaultThing()
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.defaultThing = res.data;
      });
  }
}
