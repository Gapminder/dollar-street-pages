import {Component, OnInit, OnDestroy, Input, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink, LoaderComponent]
})

export class PhotographerPlacesComponent implements OnInit, OnDestroy {
  @Input()
  private photographerId:string;

  private places:any = [];
  private familyThingId:string;
  private photographerPlacesService:any;
  public loader:boolean = false;
  public photographerPlacesServiceSubscribe:any;
  public math:any;

  constructor(@Inject('PhotographerPlacesService') photographerPlacesService,
  @Inject('Math') math) {
    this.photographerPlacesService = photographerPlacesService;
    this.math = math;
  }

  ngOnInit():void {
    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.places = res.data.places;
        this.familyThingId = res.data.familyThingId;
        this.loader = true;
      });
  }

  ngOnDestroy() {
    this.photographerPlacesServiceSubscribe.unsubscribe();
  }
}
