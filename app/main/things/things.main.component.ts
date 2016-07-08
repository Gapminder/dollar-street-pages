import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';

let tpl = require('./things.main.template.html');
let style = require('./things.main.css');

@Component({
  selector: 'things-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class ThingsMainComponent implements OnInit, OnDestroy {
  public thingsMainService:any;
  public things:any[] = [];
  private thingsMainServiceSubscribe:any;

  public constructor(@Inject('ThingsMainService') thingsMainService:any) {
    this.thingsMainService = thingsMainService;
  }

  public ngOnInit():void {
    this.thingsMainServiceSubscribe = this.thingsMainService.getMainThings()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.things = res.things;
      });
  }

  public ngOnDestroy():any {
    this.thingsMainServiceSubscribe.unsubscribe();
  }
}
