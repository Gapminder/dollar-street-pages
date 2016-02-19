import { Component, OnInit , Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {ThingsMainService} from './things.main.service';


let tpl = require('./things.main.component.html');
let style = require('./things.main.component.css');

@Component({
  selector: 'things-main',
  template: tpl,
  styles: [style],
  directives:[RouterLink],
  providers: [ThingsMainService]
})

export class ThingsMainComponent {
  public thingsMainService:ThingsMainService;
  public things:any[]=[];

  constructor(@Inject(ThingsMainService) thingsMainService:any) {
    this.thingsMainService = thingsMainService;
  }

  ngOnInit(): void {
    this.thingsMainService.getMainThings({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.things = res.things;
      });
  }
}
