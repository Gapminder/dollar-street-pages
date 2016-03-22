import {Component, OnInit, Input Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';

import {PhotographerPlacesService} from './photographer-places.service';
import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On, LoaderComponent]
})

export class PhotographerPlacesComponent implements OnInit {
  @Input()
  private photographerId:string;

  private countries:any = [];
  private familyThingId:string;
  private photographerPlacesService:PhotographerPlacesService;
  public loader:boolean = false;

  constructor(@Inject(PhotographerPlacesService) photographerPlacesService) {
    this.photographerPlacesService = photographerPlacesService;
  }

  ngOnInit():void {
    this.photographerPlacesService.getPhotographerPlaces(`id=${this.photographerId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.countries = res.data.countries;
        this.familyThingId = res.data.familyThingId;
        this.loader = true;
      });
  }
}
