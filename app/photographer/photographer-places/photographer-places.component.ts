import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { LoaderComponent } from '../../common/loader/loader.component';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink, LoaderComponent]
})

export class PhotographerPlacesComponent implements OnInit, OnDestroy {
  public loader:boolean = false;
  public photographerPlacesServiceSubscribe:any;
  public math:any;

  @Input()
  private photographerId:string;
  private places:any = [];
  private photographerPlacesService:any;

  public constructor(@Inject('PhotographerPlacesService') photographerPlacesService:any,
                     @Inject('Math') math:any) {
    this.photographerPlacesService = photographerPlacesService;
    this.math = math;
  }

  public ngOnInit():void {
    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}`)
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.loader = true;
      });
  }

  public ngOnDestroy():void {
    this.photographerPlacesServiceSubscribe.unsubscribe();
  }
}
