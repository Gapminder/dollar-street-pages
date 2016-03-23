import {Component, OnInit,OnDestroy, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';

import {ThingsMainService} from './things.main.service';

let tpl = require('./things.main.template.html');
let style = require('./things.main.css');

@Component({
  selector: 'things-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On]
})

export class ThingsMainComponent implements OnInit,OnDestroy{
  public thingsMainService:ThingsMainService;
  public things:any[] = [];
  private thingsMainServiceSubscribe:any;

  constructor(@Inject(ThingsMainService) thingsMainService) {
    this.thingsMainService = thingsMainService;
  }

  ngOnInit():void {
    this.thingsMainServiceSubscribe = this.thingsMainService.getMainThings({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.things = res.things;
      });
  }

  ngOnDestroy() {
    this.thingsMainServiceSubscribe.unsubscribe();
  }
}
