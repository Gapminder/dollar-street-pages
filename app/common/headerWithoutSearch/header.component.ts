import {Component, Inject, Input, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {MainMenuComponent} from '../menu/menu.component';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent, RouterLink]
})

export class HeaderWithoutSearchComponent implements OnInit, OnDestroy {
  @Input()
  private title:string;
  @Input()
  private subTitle:string;

  private defaultThing:any;
  private headerService:any;
  private headerServiceSibscribe:any;

  public constructor(@Inject('HeaderService') headerService:any) {
    this.headerService = headerService;
  }

  public ngOnInit():void {
    this.headerServiceSibscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.defaultThing = res.data;
      });
  }

  public ngOnDestroy():void {
    this.headerServiceSibscribe.unsubscribe();
  }
}
