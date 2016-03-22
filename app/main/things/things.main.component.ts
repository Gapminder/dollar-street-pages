import {Component, OnInit, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

import {ThingsMainService} from './things.main.service';

let tpl = require('./things.main.component.html');
let style = require('./things.main.component.css');

@Component({
  selector: 'things-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On]
})

export class ThingsMainComponent implements OnInit {
  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;
  public thingsMainService:ThingsMainService;
  public things:any[] = [];

  constructor(@Inject(ThingsMainService) thingsMainService,
              @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.thingsMainService = thingsMainService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
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
