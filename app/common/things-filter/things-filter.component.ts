import {
  OnInit,
  Component,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  NgZone
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, Observable } from 'rxjs/Rx';
import { Config } from '../../app.config';
import { ThingsFilterService } from './things-filter.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

// fixme
// let device = require('device.js')();
// let isDesktop = device.desktop();
let isDesktop = true;

@Component({
  selector: 'things-filter',
  templateUrl: './things-filter.template.html',
  styleUrls: ['./things-filter.css', './things-filter-mobile.css']
})

export class ThingsFilterComponent implements OnInit, OnDestroy, OnChanges {
  protected relatedThings: any[];
  protected popularThings: any[];
  protected otherThings: any[];
  protected activeThing: any = {};
  protected search: {text: string;} = {text: ''};
  protected isOpenThingsFilter: boolean = false;
  protected activeColumn: string = '';
  protected angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  protected things: any = [];
  protected isDesktop: boolean = isDesktop;
  protected filterTopDistance: number = 0;

  private zone: NgZone;
  private resizeSubscribe: Subscription;
  private openMobileFilterView: boolean = false;
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
                     zone: NgZone,
                     thingsFilterService: ThingsFilterService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.thingsFilterService = thingsFilterService;
    this.activatedRoute = activatedRoute;
    this.element = element.nativeElement;
    this.zone = zone;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenThingsFilter) {
      this.isOpenThingsFilter = false;
      this.search = {text: ''};
    }
  }

  public ngOnInit(): void {
    this.isOpenMobileFilterView();
    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.isOpenMobileFilterView();
        });
      });
  }

  protected openThingsFilter(isOpenThingsFilter: boolean): void {
    this.isOpenThingsFilter = !isOpenThingsFilter;

    this.search = {text: ''};
    if (this.isOpenThingsFilter && !isDesktop) {
      this.things = this.relatedThings;
      this.activeColumn = 'related';
    }

    if (this.isOpenThingsFilter) {
      Config.getCoordinates('things-filter', (data: any) => {
        this.filterTopDistance = data.top;

        setTimeout(() => {
          this.isOpenMobileFilterView();
        }, 0);
      });
    }

    if (!this.isOpenThingsFilter) {
      this.openMobileFilterView = window.innerWidth < 1024 || !isDesktop;
    }
  }

  protected goToThing(thing: any): void {
    if (thing.empty) {
      return;
    }

    this.angulartics2GoogleAnalytics.eventTrack(`Matrix page with thing - ${thing.plural}`, {});
    let query = this.parseUrl(this.url);
    query.thing = thing.plural;

    this.selectedFilter.emit({url: this.objToQuery(query), thing: this.activeThing});
    this.isOpenThingsFilter = false;
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
    if (tabContent) {
      tabContent.scrollTop = 0;
    }
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

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
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

  private isOpenMobileFilterView(): void {
    if (window.innerWidth < 1024 || !isDesktop) {
      this.openMobileFilterView = true;
      if (this.activeColumn === 'all') {
        return;
      }
      this.setActiveThingsColumn('related');
      return;
    }

    let thingsFilterContainer = this.element.querySelector('#things-filter .things-filter-container') as HTMLElement;
    let thingsFilterButtonContainer = this.element.querySelector('#things-filter .things-filter-button-content') as HTMLElement;

    if (thingsFilterContainer && window.innerHeight <
      (this.filterTopDistance + thingsFilterContainer.offsetHeight + thingsFilterButtonContainer.offsetHeight)) {
      this.openMobileFilterView = true;
      this.setActiveThingsColumn('related');
    } else {
      this.openMobileFilterView = false;
    }
  }
}
