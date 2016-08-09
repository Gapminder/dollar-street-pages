import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LoaderComponent } from '../../common/loader/loader.component';
import { Subscriber } from 'rxjs/Rx';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, LoaderComponent]
})

export class PhotographerPlacesComponent implements OnInit, OnDestroy {
  public loader: boolean = false;
  public photographerPlacesServiceSubscribe: Subscriber<any>;
  public math: any;

  @Input()
  private photographerId: string;
  private places: any = [];
  private photographerPlacesService: any;

  public constructor(@Inject('PhotographerPlacesService') photographerPlacesService: any,
                     @Inject('Math') math: any) {
    this.photographerPlacesService = photographerPlacesService;
    this.math = math;
  }

  public ngOnInit(): void {
    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.loader = true;
      });
  }

  public ngOnDestroy(): void {
    this.photographerPlacesServiceSubscribe.unsubscribe();
  }
}
