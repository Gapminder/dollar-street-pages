import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

let tpl = require('./photographer-places.template.html');
let style = require('./photographer-places.css');

@Component({
  selector: 'photographer-places',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES]
})

export class PhotographerPlacesComponent implements OnInit, OnDestroy {
  public photographerPlacesServiceSubscribe: Subscription;
  public math: any;

  @Input()
  private photographerId: string;
  private places: any = [];
  private photographerPlacesService: any;
  private loaderService: any;

  public constructor(@Inject('PhotographerPlacesService') photographerPlacesService: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('Math') math: any) {
    this.photographerPlacesService = photographerPlacesService;
    this.loaderService = loaderService;
    this.math = math;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.photographerPlacesServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
