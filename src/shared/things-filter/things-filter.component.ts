import 'rxjs/add/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
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
  NgZone,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import * as ThingsFilterActions from './ngrx/things-filter.actions';
import {
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  ActiveThingService,
  UtilsService
} from '../../common';
import { KeyCodes } from '../../enums';

@Component({
  selector: 'things-filter',
  templateUrl: './things-filter.component.html',
  styleUrls: ['./things-filter.component.css', './things-filter.component.mobile.css']
})
export class ThingsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('tabsHeaderContainer')
  public tabsHeaderContainer: ElementRef;
  @ViewChild('tabsContentContainer')
  public tabsContentContainer: ElementRef;
  @ViewChild('thingsSearch')
  public thingsSearch: ElementRef;

  @Output()
  public isFilterGotData: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public query: string;
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
  public keyUpSubscribe: Subscription;
  public activatedRoute: ActivatedRoute;
  public element: HTMLElement;
  public activeThingService: ActiveThingService;
  public thingsFilterState: Observable<any>;
  public isInit: boolean;
  public thingsFilterStateSubscribtion: Subscription;

  public constructor(activatedRoute: ActivatedRoute,
                     element: ElementRef,
                     zone: NgZone,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     activeThingService: ActiveThingService,
                     utilsService: UtilsService,
                     private store: Store<AppStates>) {
    this.activatedRoute = activatedRoute;
    this.element = element.nativeElement;
    this.zone = zone;
    this.device = browserDetectionService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.activeThingService = activeThingService;
    this.utilsService = utilsService;

    this.thingsFilterState = this.store.select((appStates: AppStates) => appStates.thingsFilter);
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenThingsFilter) {
      this.isOpenThingsFilter = false;
      this.search = {text: ''};
    }

    if (this.tabsHeaderContainer && this.tabsContentContainer) {
      if (this.tabsHeaderContainer.nativeElement.clientHeight > 60) {
        this.tabsContentContainer.nativeElement.classList.add('tabs-content-container-two-rows');
      }
    }
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.isOpenMobileFilterView();

    this.thingsFilterStateSubscribtion = this.thingsFilterState.subscribe((data: any) => {
      if(data) {
        this.relatedThings = data.relatedThings;
        this.popularThings = data.popularThings;
        this.otherThings = data.otherThings;
        this.activeThing = data.thing;

        this.isFilterGotData.emit('isThingFilterReady');

        this.activeThingService.setActiveThing(this.activeThing);
      }
    });

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

    let thingsContentElement: HTMLElement = this.element.querySelector('.other-things-content') as HTMLElement;

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

      thingsContentElement.addEventListener('mousewheel', (e) => {
        let whellDir: string = e.wheelDelta < 0 ? 'down' : 'up';

        let deltaHeight: number = thingsContentElement.scrollHeight - thingsContentElement.offsetHeight;

        if (whellDir === 'up' && thingsContentElement.scrollTop === 0) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (whellDir === 'down' && thingsContentElement.scrollTop >= deltaHeight) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, false);
    }

    if (!this.isOpenThingsFilter) {
      this.openMobileFilterView = window.innerWidth < 1024 || !this.isDesktop;
    }
  }

  public goToThing(thing: any): void {
    if (thing.empty) {
      return;
    }

    let query: any = this.utilsService.parseUrl(this.query);
    query.thing = thing.originPlural;

    const newUrl: string = this.utilsService.objToQuery(query);

    this.isOpenThingsFilter = false;
    this.search = {text: ''};

    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(newUrl));

    this.selectedFilter.emit({url: newUrl, thing: this.activeThing});

    this.angulartics2GoogleAnalytics.eventTrack(`Matrix page with thing - ${thing.plural}`, {});
  }

  public setActiveThingsColumn(column: string): void {
    this.activeColumn = column;
    this.search = {text: ''};

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
    if (this.tabsContentContainer) {
      this.tabsContentContainer.nativeElement.scrollTop = 0;
    }
  }

  public hideKeyboard(): void {
    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    let inputElement = this.element.querySelector('.form-control') as HTMLInputElement;

    this.keyUpSubscribe = fromEvent(inputElement, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (e.keyCode === KeyCodes.enter) {
          inputElement.blur();
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.thingsFilterStateSubscribtion) {
      this.thingsFilterStateSubscribtion.unsubscribe();
    }
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
