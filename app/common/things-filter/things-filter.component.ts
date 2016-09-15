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
import { ThingsFilterPipe } from './things-filter.pipe';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Rx';

let device = require('device.js')();
let isDesktop = device.desktop();

let styleMobile = require('./things-filter-mobile.css');
let style = require('./things-filter.css');

@Component({
  selector: 'things-filter',
  template: require('./things-filter.template.html'),
  styles: [isDesktop ? style : styleMobile],
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
  protected isDesktop: boolean = isDesktop;

  @Output('isFilterGotData')
  private isFilterGotData: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  private url: string;
  @Output()
  private selectedFilter: EventEmitter<any> = new EventEmitter<any>();
  private thingsFilterService: any;
  private thingsFilterServiceSubscribe: Subscription;
  private keyUpSubscribe: Subscription;
  private activatedRoute: ActivatedRoute;
  private element: HTMLElement;

  public constructor(activatedRoute: ActivatedRoute,
                     element: ElementRef,
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
    this.isOpenThingsFilter = !isOpenThingsFilter;
    if (!this.isOpenThingsFilter && !isDesktop) {
      document.body.classList.remove('hideScroll');
    }

    this.search = {text: ''};

    if (this.isOpenThingsFilter && !isDesktop) {
      this.things = this.relatedThings;
      this.activeColumn = 'related';
      document.body.classList.add('hideScroll');
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
    document.body.classList.remove('hideScroll');
    this.search = {text: ''};
  }

  protected setActiveThingsColumn(column: string): void {
    this.activeColumn = column;
    this.search = {text: ''};
    let tabContent = this.element.querySelector('.tabs-content-container') as HTMLElement;
    switch (column) {
      case 'related' :
        this.things = this.relatedThings;
        break;
      case 'popular' :
        this.things = this.popularThings;
        break;
      case 'all' :

        this.hideKeyboard();

        this.things = this.otherThings;
        break;
      default:
        this.things = this.relatedThings;
    }
    tabContent.scrollTop = 0;
  }

  protected hideKeyboard(): void {

    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    let inputElement = this.element.querySelector('.form-control') as HTMLInputElement;
    this.keyUpSubscribe = fromEvent(inputElement, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (e.keyCode === 13) {
          inputElement.blur();
        }
      });
  }

  public ngOnDestroy(): void {
    this.thingsFilterServiceSubscribe.unsubscribe();
    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }
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
          this.isFilterGotData.emit('isThingFilterReady');
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
