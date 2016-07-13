import { Component, Input, Output, Inject, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { RouterLink, Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import { MainMenuComponent } from '../menu/menu.component';
import { PlaceMapComponent } from '../place-map/place-map.component';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { IncomesFilterComponent } from '../incomes-filter/incomes-filter.component';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';

let device = require('device.js')();

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [ThingsFilterComponent, IncomesFilterComponent, CountriesFilterComponent, MainMenuComponent, PlaceMapComponent, RouterLink]
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
  private filter:EventEmitter<any> = new EventEmitter();
  private activeThing:any;
  private defaultThing:any;
  private headerService:any;
  private router:Router;

  private matrixComponent:boolean;
  private placeComponent:boolean;
  private mapComponent:boolean;
  private headerServiceSubscribe:any;
  private headerTitleServiceSubscribe:any;

  public constructor(@Inject('HeaderService') headerService:any,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any) {
    this.headerService = headerService;
    this.router = router;
    this.math = math;

    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
    this.mapComponent = this.router.hostComponent.name === 'MapComponent';
  }

  public ngOnInit():void {
    this.headerServiceSubscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.defaultThing = res.data;
      });

    if (this.placeComponent) {
      this.headerTitleServiceSubscribe = this
        .headerService
        .getPlaceHeader(this.query)
        .subscribe((res:any) => {
          if (res.err) {
            return res.err;
          }

          this.header = res.data;
        });
    }
  }

  public ngOnChanges(changes:any):void {
    if (
      this.placeComponent &&
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
            return res.err;
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
