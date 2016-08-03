import { Component, Input, Output, Inject, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Rx';
import { MainMenuComponent } from '../menu/menu.component';
import { PlaceMapComponent } from '../place-map/place-map.component';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';

let device:{desktop:Function} = require('device.js')();

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [
    ROUTER_DIRECTIVES,
    ThingsFilterComponent,
    CountriesFilterComponent,
    MainMenuComponent,
    PlaceMapComponent
  ]
})

export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  protected query:string;
  @Input()
  protected thing:string;
  @Input('hoverPlace')
  protected hoverPlace:Observable<any>;
  @Input('chosenPlaces')
  protected chosenPlaces:Observable<any>;
  protected isOpenFilter:boolean = false;
  protected isDesktop:boolean = device.desktop();
  protected header:any = {};
  protected math:any;
  @Output()
  private filter:EventEmitter<any> = new EventEmitter<any>();
  private activeThing:any;
  private defaultThing:any;
  private headerService:any;
  private router:Router;
  private activatedRoute:ActivatedRoute;
  private window:Window = window;
  private angulartics2GoogleAnalytics:any;

  private matrixComponent:boolean;
  private headerServiceSubscribe:Subscriber;
  private headerTitleServiceSubscribe:Subscriber;

  public constructor(@Inject('HeaderService') headerService:any,
                     @Inject(Router) router:Router,
                     @Inject(ActivatedRoute) activatedRoute:ActivatedRoute,
                     @Inject('Math') math:any,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics:any) {
    this.headerService = headerService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.math = math;

    this.matrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
  }

  public ngOnInit():void {
    this.headerServiceSubscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.defaultThing = res.data;
      });
  }

  public ngOnChanges(changes:any):void {
    if (
      changes.query &&
      typeof changes.query.previousValue === 'string' &&
      typeof changes.query.currentValue === 'string'
    ) {
      let currentQuery = this.parseUrl(changes.query.currentValue);
      let previousQuery = this.parseUrl(changes.query.previousValue);

      if (currentQuery.place === previousQuery.place) {
        return;
      }

      if (this.headerTitleServiceSubscribe) {
        this.headerTitleServiceSubscribe.unsubscribe();
      }

      this.headerTitleServiceSubscribe = this
        .headerService
        .getPlaceHeader(this.query)
        .subscribe((res:any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.header = res.data;
        });
    }
  }

  public ngOnDestroy():void {
    this.headerServiceSubscribe.unsubscribe();

    if (this.headerTitleServiceSubscribe) {
      this.headerTitleServiceSubscribe.unsubscribe();
    }
  }

  public urlTransfer(data:any):void {
    this.filter.emit(data);
  }

  public activeThingTransfer(thing:any):void {
    this.activeThing = thing;
  }

  protected goToMatrixPage():void {
    this.angulartics2GoogleAnalytics.eventTrack('Matrix page');

    if (this.matrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  private parseUrl(url:string):any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    if (query.regions) {
      query.regions = query.regions.split(',');
    }

    if (query.countries) {
      query.countries = query.countries.split(',');
    }

    return query;
  }
}
