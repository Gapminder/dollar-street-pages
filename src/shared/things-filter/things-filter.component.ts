import 'rxjs/add/operator/debounceTime';

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
import { Subscription } from 'rxjs/Subscription';

import {
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  ActiveThingService,
  UtilsService
} from '../../common';

import { ThingsFilterService } from './things-filter.service';

@Component({
  selector: 'things-filter',
  templateUrl: './things-filter.component.html',
  styleUrls: ['./things-filter.component.css', './things-filter-mobile.component.css']
})

export class ThingsFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Output('isFilterGotData')
  public isFilterGotData: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public url: string;
  @Output()
  public selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  public relatedThings: any[];
  public popularThings: any[];
  public otherThings: any[];
  public activeThing: any = {};
  public search: {text: string;} = {text: ''};
  public isOpenThingsFilter: boolean = false;
  public activeColumn: string = '';
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public things: any = [];
  public filterTopDistance: number = 0;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public zone: NgZone;
  public resizeSubscribe: Subscription;
  public utilsService: UtilsService;
  public openMobileFilterView: boolean = false;
  public thingsFilterService: any;
  public thingsFilterServiceSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public activatedRoute: ActivatedRoute;
  public element: HTMLElement;
  public activeThingService: ActiveThingService;

  public constructor(activatedRoute: ActivatedRoute,
                     element: ElementRef,
                     zone: NgZone,
                     thingsFilterService: ThingsFilterService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     activeThingService: ActiveThingService,
                     utilsService: UtilsService) {
    this.thingsFilterService = thingsFilterService;
    this.activatedRoute = activatedRoute;
    this.element = element.nativeElement;
    this.zone = zone;
    this.device = browserDetectionService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.activeThingService = activeThingService;
    this.utilsService = utilsService;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenThingsFilter) {
      this.isOpenThingsFilter = false;
      this.search = {text: ''};
    }

    let tabsHeaderContainer: HTMLElement = this.element.querySelector('.tabs-header-container') as HTMLElement;
    let tabsContentContainer: HTMLElement = this.element.querySelector('.tabs-content-container') as HTMLElement;

    if (tabsHeaderContainer) {
      if (tabsHeaderContainer.clientHeight > 60) {
        tabsContentContainer.classList.add('tabs-content-container-two-rows');
      }
    }
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.isOpenMobileFilterView();

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.isOpenMobileFilterView();
        });
      });
  }

  public openThingsFilter(isOpenThingsFilter: boolean): void {
    this.isOpenThingsFilter = !isOpenThingsFilter;

    this.search = {text: ''};
    if (this.isOpenThingsFilter && !this.isDesktop) {
      this.things = this.relatedThings;
      this.activeColumn = 'related';
    }

    if (this.isOpenThingsFilter) {
      this.utilsService.getCoordinates('things-filter', (data: any) => {
        this.filterTopDistance = data.top;

        setTimeout(() => {
          this.isOpenMobileFilterView();
        }, 0);
      });
    }

    if (!this.isOpenThingsFilter) {
      this.openMobileFilterView = window.innerWidth < 1024 || !this.isDesktop;
    }
  }

  public goToThing(thing: any): void {
    if (thing.empty) {
      return;
    }

    let query = this.parseUrl(this.url);
    query.thing = thing.originPlural;

    this.selectedFilter.emit({url: this.objToQuery(query), thing: this.activeThing});
    this.isOpenThingsFilter = false;
    this.search = {text: ''};

    this.angulartics2GoogleAnalytics.eventTrack(`Matrix page with thing - ${thing.plural}`, {});
  }

  public setActiveThingsColumn(column: string): void {
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

  public hideKeyboard(): void {
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

          this.activeThingService.setActiveThing(this.activeThing);
        });
    }
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  public parseUrl(url: string): any {
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

  public isOpenMobileFilterView(): void {
    if (window.innerWidth < 1024 || !this.isDesktop) {
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
