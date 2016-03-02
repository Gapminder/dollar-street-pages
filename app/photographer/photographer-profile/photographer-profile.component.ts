import { Component, OnInit , Inject } from 'angular2/core';
import { RouterLink, RouteParams } from 'angular2/router';
import {PhotographerProfileService} from './photographer-profile.service';


let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives:[RouterLink]
})

export class PhotographerProfileComponent implements OnInit{
  private photographer:any = {};
  private thing:any;

  constructor(@Inject(PhotographerProfileService)
              private photographerProfileService,
              @Inject(RouteParams)
              private routeParams) {
  }

  ngOnInit(): void {
    this.photographer.name = this.routeParams.get('photographer');

    let query = `photographer=${this.photographer.name}`;

    this.photographerProfileService.getPhotographer(query)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographer.places = res.data.places;
        this.photographer.name = res.data.name;
        this.thing = res.data.thing;
      });
  }
}
