import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MathService } from '../math-service/math-service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

let device: {desktop: Function; mobile: Function} = require('device.js')();
let isMobile: boolean = device.mobile();

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style]
})

export class HeaderComponent implements OnChanges {
  @Input()
  protected query: string;
  @Input()
  protected thing: string;
  @Input('hoverPlace')
  protected hoverPlace: Observable<any>;
  protected isOpenFilter: boolean = false;
  protected isDesktop: boolean = device.desktop();
  protected header: any = {};
  protected isCountryFilterReady: boolean = false;
  protected isThingFilterReady: boolean = false;
  private math: any;

  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  @Output()
  private filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();
  private activeThing: any;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private window: Window = window;

  private matrixComponent: boolean;
  private mapComponent: boolean;

  public constructor(router: Router,
                     math: MathService,
                     activatedRoute: ActivatedRoute,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;

    this.matrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
    this.mapComponent = this.activatedRoute.snapshot.url[0].path === 'map';
  }

  public ngOnChanges(changes: any): void {
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
    }
  }

  protected openIncomeFilter(): void {
    if (!isMobile) {
      return;
    }

    this.isOpenIncomeFilter.emit({});
  }

  public urlTransfer(data: any): void {
    this.filter.emit(data);
  }

  public activeThingTransfer(thing: any): void {
    this.activeThing = thing;
  }

  protected goToMatrixPage(): void {
    if (this.matrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.angulartics2GoogleAnalytics.pageTrack(`From header to Matrix page`);
    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  protected isFilterGotData(event: any): any {
    this[event] = true;
  }

  private parseUrl(url: string): any {
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
