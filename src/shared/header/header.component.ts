import { Component, Input, Output, OnChanges, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
  MathService,
  Angulartics2GoogleAnalytics,
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService
} from '../../common';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnChanges {
  public element: HTMLElement;

  @Input()
  protected query: string;
  @Input()
  protected thing: string;
  @Input('hoverPlace')
  protected hoverPlace: Observable<any>;
  protected header: any = {};
  protected isCountryFilterReady: boolean = false;
  protected isThingFilterReady: boolean = false;

  @Output()
  private filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();
  private streetData: DrawDividersInterface;
  private activeThing: any;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private matrixComponent: boolean;
  private mapComponent: boolean;
  private math: MathService;
  private streetServiceSubscribe: Subscription;
  private streetSettingsService: StreetSettingsService;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private device: BrowserDetectionService;
  private isDesktop: boolean;
  private isMobile: boolean;

  public constructor(router: Router,
                     math: MathService,
                     activatedRoute: ActivatedRoute,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.device = browserDetectionService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;

    this.element = element.nativeElement;

    this.matrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
    this.mapComponent = this.activatedRoute.snapshot.url[0].path === 'map';
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });
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
    if (!this.isMobile) {
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
    let queryParams = {
      thing: 'Families',
      countries: 'World',
      regions: 'World',
      zoom: 4,
      row: 1,
      lowIncome: this.streetData.poor,
      highIncome: this.streetData.rich
    };

    if (!this.isDesktop) {
      queryParams.zoom = 3;
    }

    if (this.matrixComponent) {
      this.filter.emit({url: this.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
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

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
