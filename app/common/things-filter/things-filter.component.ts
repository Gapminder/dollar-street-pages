import {
  Component,
  OnDestroy,
  OnChanges,
  Inject,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs/Rx';
import { ThingsFilterPipe } from './things-filter.pipe';

let device = require('device.js')();
let isDesktop = device.desktop();

let tplMobile = require('./things-filter-mobile.template.html');
let styleMobile = require('./things-filter-mobile.css');

let tpl = require('./things-filter.template.html');
let style = require('./things-filter.css');
@Component({
  selector: 'things-filter',
  template: isDesktop ? tpl : tplMobile,
  styles: isDesktop ? [style] : [styleMobile],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ThingsFilterPipe]
})

export class ThingsFilterComponent implements OnDestroy, OnChanges {
  protected relatedThings: any[];
  protected popularThings: any[];
  protected otherThings: any[];
  protected activeThing: any = {};
  protected search: {text: string;} = {text: ''};
  protected isOpenThingsFilter: boolean = false;
  protected activeColumn: string = '';
  protected Angulartics2GoogleAnalytics: any;
  protected things: any = [];
  @Input()
  private url: string;
  @Output()
  private selectedFilter: EventEmitter<any> = new EventEmitter<any>();
  private thingsFilterService: any;
  private thingsFilterServiceSubscribe: Subscriber<any>;
  private activatedRoute: ActivatedRoute;
  private element: HTMLElement;

  public constructor(@Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject('ThingsFilterService') thingsFilterService: any,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.thingsFilterService = thingsFilterService;
    this.activatedRoute = activatedRoute;
    this.element = element.nativeElement;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenThingsFilter) {
      this.isOpenThingsFilter = false;
      this.search = {text: ''};
    }
  }

  protected openThingsFilter(isOpenThingsFilter: boolean): void {
    let element = document.getElementById('scrollBackToTop');

    this.isOpenThingsFilter = !isOpenThingsFilter;
    if (!this.isOpenThingsFilter && !isDesktop) {
      element.style.overflow = '';
    }

    this.search = {text: ''};

    if (this.isOpenThingsFilter && !isDesktop) {
      this.things = this.relatedThings;
      this.activeColumn = 'related';
      element.style.overflow = 'hidden';
    }
  }

  protected goToThing(thing: any): void {
    if (thing.empty) {
      return;
    }

    this.Angulartics2GoogleAnalytics.eventTrack(`Matrix page with thing - ${thing.thingName} `);
    let query = this.parseUrl(this.url);
    query.thing = thing.plural;

    this.selectedFilter.emit({url: this.objToQuery(query), thing: this.activeThing});
    this.isOpenThingsFilter = false;
    let element = document.getElementById('scrollBackToTop');
    element.style.overflow = '';
    this.search = {text: ''};
  }

  protected setActiveThingsColumn(column: string): void {
    this.activeColumn = column;
    this.search = {text: ''};
    if (column === 'related') {
      this.things = this.relatedThings;
    }
    let tabContent = this.element.querySelector('.tabs-content-container') as HTMLElement;
    if (column === 'popular') {
      this.things = this.popularThings;
    }

    if (column === 'all') {
      this.things = this.otherThings;
    }
    tabContent.scrollTop = 0;

  }

  public ngOnDestroy(): void {
    this.thingsFilterServiceSubscribe.unsubscribe();
  }

  public ngOnChanges(changes: any): void {
    if (changes.url && changes.url.currentValue) {
      if (this.thingsFilterServiceSubscribe) {
        this.thingsFilterServiceSubscribe.unsubscribe();
      }

      this.thingsFilterServiceSubscribe = this
        .thingsFilterService
        .getThings(this.url)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.relatedThings = res.data.relatedThings;
          this.popularThings = res.data.popularThings;
          this.otherThings = res.data.otherThings;
          this.activeThing = res.data.thing;
        });
    }
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
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
