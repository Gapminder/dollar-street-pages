import {Component, OnInit, Input Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {PhotographerPlacesService} from './photographer-places.service';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class PhotographerPlacesComponent implements OnInit {
  @Input()
  private photographerName:string;

  private countries:any = [];
  private familyThingId:string;
  private photographerPlacesService:PhotographerPlacesService;

  constructor(@Inject(PhotographerPlacesService) photographerPlacesService) {
    this.photographerPlacesService = photographerPlacesService;
  }

  ngOnInit():void {
    this.photographerPlacesService.getPhotographerPlaces(`name=${this.photographerName}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        
        console.log(res.data.countries);

        this.countries = res.data.countries;
        this.familyThingId = res.data.familyThingId;
      });
  }
}
