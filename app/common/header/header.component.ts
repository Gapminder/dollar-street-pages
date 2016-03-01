import {Component, Input, Output, Inject, OnInit, EventEmitter} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {HeaderService} from './header.service';
import {MainMenuComponent} from '../menu/menu.component';
import {SearchComponent} from '../search/search.component';

let tpl = require('./header.component.html');
let style = require('./header.component.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [SearchComponent, MainMenuComponent, RouterLink]
})

export class HeaderComponent implements OnInit {
  @Input()
  private query:string;
  @Output()
  private filter:EventEmitter<any> = new EventEmitter();

  private activeThing:any;
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

  urlTransfer(url) {
    this.filter.emit(url);
  }

  activeThingTransfer(thing) {
    this.activeThing = thing;
  }
}
