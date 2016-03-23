import {Component, Inject, Input, OnInit,OnDestroy} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {HeaderService} from '../header/header.service';
import {MainMenuComponent} from '../menu/menu.component';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent, RouterLink]
})

export class HeaderWithoutSearchComponent implements OnInit,OnDestroy {
  @Input()
  private title:string;
  private defaultThing:any;
  private headerService:HeaderService;
  private headerServiceSibscribe:any;

  constructor(@Inject(HeaderService) headerService) {
    this.headerService = headerService;
  }

  ngOnInit():void {
    this.headerServiceSibscribe=this.headerService.getDefaultThing()
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.defaultThing = res.data;
      });
  }
  ngOnDestroy():void{
    this.headerServiceSibscribe.unsubscribe()
  }
}
