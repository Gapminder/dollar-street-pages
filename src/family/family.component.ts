import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  AppStates,
  CountriesFilterState,
} from '../interfaces';
import * as AppActions from '../app/ngrx/app.actions';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { chain, get } from 'lodash';
import {
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  LanguageService,
  DrawDividersInterface,
  UtilsService
} from '../common';
import { FamilyService } from './family.service';
import { FamilyMediaComponent } from './family-media';
import { FamilyHeaderComponent } from './family-header';
import { DEBOUNCE_TIME, DefaultUrlParameters } from "../defaultState";
import { combineLatest } from "rxjs/observable/combineLatest";

@Component({
  selector: 'family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(FamilyMediaComponent)
  public familyMediaComponent: FamilyMediaComponent;
  @ViewChild(FamilyHeaderComponent)
  public familyHeaderComponent: FamilyHeaderComponent;
  @ViewChild('familyContainer')
  public familyContainer: ElementRef;

  public theWorldTranslate: string;
  public window: Window = window;
  public document: Document = document;
  public streetFamilyData: {income: number; region: string};
  public zoom: number;
  public openFamilyExpandBlock: Subject<any> = new Subject<any>();
  public placeId: string;
  public urlParams;
  public streetSettings: DrawDividersInterface;
  public rich;
  public poor;
  public thing = {};
  public locations: CountriesFilterState;
  public countries: {}[];
  public activeImageIndex: number;
  public windowHistory = history;
  public getTranslationSubscribe: Subscription;
  public scrollSubscribe: Subscription;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public zoomPositionFixed: boolean;
  public element: HTMLElement;
  public query: string;
  public headerElement: HTMLElement;
  public streetFamilyContainerElement: HTMLElement;
  public shortFamilyInfoContainerElement: HTMLElement;
  public streetSettingsStateSubscription: Subscription;
  @Output()
  public itemSize: number;
  public row: number;
  public rowEtalon: number;
  public appStatesSubscription: Subscription;

  public constructor(elementRef: ElementRef,
                     private router: Router,
                     private activatedRoute: ActivatedRoute,
                     private urlChangeService: UrlChangeService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private familyService: FamilyService,
                     private languageService: LanguageService,
                     private browserDetectionService: BrowserDetectionService,
                     private store: Store<AppStates>,
                     private utilsService: UtilsService,
                     private changeDetectorRef: ChangeDetectorRef) {
    this.element = elementRef.nativeElement;

    this.isDesktop = this.browserDetectionService.isDesktop();
  }

  public ngOnInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('THE_WORLD').subscribe(trans => {
      this.theWorldTranslate = trans.toLowerCase();
    });

    this.appStatesSubscription = this.store.debounceTime(DEBOUNCE_TIME)
      .subscribe((data: AppStates) => {
      const matrix = data.matrix;
      const streetSetting = data.streetSettings;
      const countriesFilter = data.countriesFilter;

      this.zoom = Number(get(matrix, 'zoom', DefaultUrlParameters.zoom));

      if (get(matrix, 'place', false)) {
        this.placeId = matrix.place;
      } else {
        this.router.navigate(['/matrix']);
        this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from Home page', {});
      }

      if (this.streetSettings !== streetSetting.streetSettings) {
        this.streetSettings = streetSetting.streetSettings;
        this.poor = this.streetSettings.poor;
        this.rich = this.streetSettings.rich;
      }
      if (this.locations !== countriesFilter) {
        this.locations = countriesFilter;

        this.countries = chain(countriesFilter)
          .map('countries')
          .flatten()
          .sortBy('country')
          .value();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.headerElement = document.querySelector('.header-content') as HTMLElement;
    this.streetFamilyContainerElement = this.element.querySelector('.street-family-container') as HTMLElement;
    this.shortFamilyInfoContainerElement = this.element.querySelector('.short-family-info-container') as HTMLElement;

    this.scrollSubscribe = fromEvent(this.window, 'scroll')
        .subscribe(() => {
          setTimeout(() => {
            if (!this.itemSize) {
              this.calcItemSize();
            }

            this.processScroll();
            this.applyStyles();
            this.setZoomButtonPosition();
          });
        });
  }

  public ngOnDestroy(): void {
    if (this.appStatesSubscription) {
      this.appStatesSubscription.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }
  }

  public scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  public changeZoom(zoom: number): void {
    const prevZoom: number = this.zoom;
    this.zoom = zoom;
    // this.urlChanged({isZoom: true, url: this.query});
    this.familyMediaComponent.changeZoom(prevZoom);
  }

  public processScroll(): void {
    const scrollTop = (document.body.scrollTop || document.documentElement.scrollTop);

    const distance = scrollTop / this.itemSize;

    if (isNaN(distance)) {
      return;
    }

    const rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.row = row + 1;

    if (this.rowEtalon !== this.row) {
      this.rowEtalon = this.row;

      if (this.query) {
        const query = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;
        this.query = query;
      }
    }
  }

  public applyStyles(): void {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    if (scrollTop > 0) {
      this.streetFamilyContainerElement.style.position = 'fixed';
      this.streetFamilyContainerElement.style.top = this.headerElement.clientHeight + 'px';
      this.streetFamilyContainerElement.style.zIndex = '995';

      this.familyContainer.nativeElement.style.paddingTop = this.headerElement.clientHeight + 'px';
    } else {
      this.streetFamilyContainerElement.style.position = 'static';
      this.streetFamilyContainerElement.style.top = '0px';
      this.streetFamilyContainerElement.style.zIndex = '0';

      this.familyContainer.nativeElement.style.paddingTop = '0px';
    }

    if (scrollTop > 140) {
      const offsetHeight: number = this.headerElement.clientHeight + this.streetFamilyContainerElement.clientHeight;

      this.shortFamilyInfoContainerElement.style.top = offsetHeight + 'px';
      this.shortFamilyInfoContainerElement.style.maxHeight = 100 + 'px';
      this.shortFamilyInfoContainerElement.style.height = 50 + 'px';
      this.shortFamilyInfoContainerElement.style.zIndex = '995';
    } else {
      this.shortFamilyInfoContainerElement.style.maxHeight = '0px';
      this.shortFamilyInfoContainerElement.style.zIndex = '0';
    }
  }

  public setZoom(zoom: number): void {
    if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
      this.zoom = zoom ? zoom : Number(DefaultUrlParameters.zoom);
    }

    if (!this.isDesktop) {
      this.zoom = 3;
    }
  }

  public calcItemSize(): void {
    const familyThingsContainerElement: HTMLElement = this.element
      .querySelector('.family-things-container') as HTMLElement;
    const familyImageContainerElement: HTMLElement = this.element
      .querySelector('.family-image-container') as HTMLElement;

    if (!familyThingsContainerElement || !familyImageContainerElement) {
      return;
    }

    const widthScroll: number = window.innerWidth - document.body.offsetWidth;

    const imageMarginLeft: string = window.getComputedStyle(familyImageContainerElement)
      .getPropertyValue('margin-left');
    const boxPaddingLeft: string = window.getComputedStyle(familyThingsContainerElement)
      .getPropertyValue('padding-left');

    const imageMargin = parseFloat(imageMarginLeft) * 2;
    const boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    const imageHeight = (familyThingsContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - imageMargin;

    this.itemSize = imageHeight + imageMargin;
  }

  public setZoomButtonPosition(): void {
    const scrollTop: number = (this.document.body.scrollTop || this.document.documentElement.scrollTop) + this.window.innerHeight;

    const containerHeight: number = this.familyContainer.nativeElement.offsetHeight + 30;

    this.zoomPositionFixed = scrollTop > containerHeight;
  }

  public activeImageOptions(options: any): void {
    const {row, activeImageIndex} = options;

    const queryParams = this.utilsService.parseUrl(this.query);

    delete queryParams.activeImage;

    if (row) {
      queryParams.row = row;
    }

    if (activeImageIndex) {
      this.activeImageIndex = activeImageIndex;
      queryParams.activeImage = activeImageIndex;
    } else {
      this.activeImageIndex = void 0;
    }

    if (!queryParams.lang) {
      queryParams.lang = this.languageService.currentLanguage;
    }

    const url = this.utilsService.objToQuery(queryParams);

    this.store.dispatch(new AppActions.SetQuery(url));
  }

  public isOpenFamilyExpandBlock(data: any): void {
    this.openFamilyExpandBlock.next(data);
  }

  public initData(): void {
    if (!this.streetSettings) {
      return;
    }

    if (!this.placeId) {
      this.router.navigate(['/matrix']);

      this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from Home page', {});

      return;
    }
  }
};
