import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscriber } from 'rxjs/Rx';

let tpl = require('./info-context.template.html');
let style = require('./info-context.css');

@Component({
  selector: 'info-context',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})

export class InfoContextComponent implements OnInit, OnDestroy {
  private infoContextService:any;
  private infoContextServiceSubscribe:Subscriber;
  private info:any;

  public constructor(@Inject('InfoContextService') infoContextService:any) {
    this.infoContextService = infoContextService;
  }

  public ngOnInit():void {
    this.infoContextServiceSubscribe = this.infoContextService.getInfo().subscribe((val:any) => {
      if (val.err) {
        console.error(val.err);
        return;
      }

      this.info = val.data;
    });
  }

  public ngOnDestroy():void {
    this.infoContextServiceSubscribe.unsubscribe();
  }
}
