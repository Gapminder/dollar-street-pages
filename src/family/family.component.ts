import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  AppState,
  AppStates,
  CountriesFilterState,
  Country,
  StreetSettingsState,
  UrlParameters
} from '../interfaces';
import * as AppActions from '../app/ngrx/app.actions';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { chain } from 'lodash';
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
import { UrlParamsInterface } from '../interfaces';

interface UrlParams extends Params {
  thing: string;
  countries: string;
  regions: string;
  zoom: number;
  row: number;
  lowIncome: number;
  highIncome: number;
  place?: string;
  activeImage?: number;
  lang: string;
}

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
  public queryParamsSubscribe: Subscription;
  public familyServiceSetThingSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;
  public scrollSubscribe: Subscription;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public zoomPositionFixed: boolean;
  public element: HTMLElement;
  public query: string;
  public streetSettingsState: Observable<StreetSettingsState>;
  public countriesFilterState: Observable<CountriesFilterState>;
  public headerElement: HTMLElement;
  public streetFamilyContainerElement: HTMLElement;
  public shortFamilyInfoContainerElement: HTMLElement;
  public streetSettingsStateSubscription: Subscription;
  public countriesFilterStateSubscription: Subscription;
  public itemSize: number;
  public row: number;
  public rowEtalon: number;
  public appState: Observable<AppState>;
  public appStateSubscription: Subscription;

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

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.countriesFilterState = this.store.select((appStates: AppStates) => appStates.countriesFilter);
  }

  public ngOnInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('THE_WORLD').subscribe(trans => {
      this.theWorldTranslate = trans.toLowerCase();

      this.initData();
    });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: UrlParameters) => {
      this.urlParams = {
        thing: params.thing ? decodeURI(params.thing) : 'Families',
        countries: params.countries ? decodeURI(params.countries) : 'World',
        regions: params.regions ? decodeURI(params.regions) : 'World',
        zoom: parseInt(params.zoom, 10) || 4,
        row: parseInt(params.row, 10) || 1,
        lowIncome: parseInt(params.lowIncome, 10),
        highIncome: parseInt(params.highIncome, 10),
        place: params.place,
        lang: this.languageService.currentLanguage
      };

      if (params.activeImage) {
        this.urlParams.activeImage = params.activeImage;
        this.activeImageIndex = +this.urlParams.activeImage;
      }

      const queryUrl: string = this.utilsService.objToQuery(this.urlParams);

      this.store.dispatch(new AppActions.SetQuery(queryUrl));
      this.urlChangeService.replaceState('/family', queryUrl);

      this.placeId = this.urlParams.place;
      this.row = +this.urlParams.row;
      this.setZoom(+this.urlParams.zoom);

      setTimeout(() => {
        if (this.row > 1 && !this.activeImageIndex) {
          this.familyMediaComponent.goToRow(this.row);
        }
      }, 1000);

      const query = `thingName=${this.urlParams.thing}${this.languageService.getLanguageParam()}`;
      this.familyServiceSetThingSubscribe = this.familyService
        .getThing(query)
        .subscribe(res => {
          if (res.err) {
            console.error(res.err);

            return;
          }

          this.thing = res.data;

          this.initData();
        });
      });

    this.appStateSubscription = this.appState.subscribe((data: AppState) => {
      if (data) {
        if (data.query) {
          if (this.query !== data.query) {
            this.query = data.query;
          }
        }
      }
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (data) {
        if (data.streetSettings) {
          if (this.streetSettings !== data.streetSettings) {
            this.streetSettings = data.streetSettings;

            this.poor = this.streetSettings.poor;
            this.rich = this.streetSettings.rich;

            if (!this.locations) {
              return;
            }

            this.initData();
          }
        }
      }
    });

    this.countriesFilterStateSubscription = this.countriesFilterState.subscribe((data: CountriesFilterState) => {
        if (data) {
          if (this.locations !== data) {
            this.locations = data;

            this.countries = chain(data)
              .map('countries')
              .flatten()
              .sortBy('country')
              .value();
            this.initData();
          }
        }
    });
  }

  public ngAfterViewInit(): void {
    this.headerElement = document.querySelector('.header-content') as HTMLElement;
    this.streetFamilyContainerElement = this.element.querySelector('.street-family-container') as HTMLElement;
    this.shortFamilyInfoContainerElement = this.element.querySelector('.short-family-info-container') as HTMLElement;

    this.scrollSubscribe = fromEvent(this.window, 'scroll')
        .debounceTime(10)
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
    if (this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if (this.familyServiceSetThingSubscribe) {
      this.familyServiceSetThingSubscribe.unsubscribe();
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

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.countriesFilterStateSubscription) {
      this.countriesFilterStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
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
    this.urlChanged({isZoom: true, url: this.query});
    this.familyMediaComponent.changeZoom(prevZoom);
  }

  public urlChanged(options): void {
    let { url } = options;
    const { isZoom, isBack } = options;

    if (isZoom) {
      this.calcItemSize();
      url = url.replace(/row\=\d*/, `row=${this.row}`).replace(/zoom\=\d*/, `zoom=${this.zoom}`);
    }

    this.store.dispatch(new AppActions.SetQuery(url));

    this.urlChangeService.replaceState('/family', url);
  }

  public processScroll(): void {
    const scrollTop = (document.body.scrollTop || document.documentElement.scrollTop); //- this.guidePositionTop;

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
      this.zoom = zoom ? zoom : 4;
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

    this.urlChangeService.replaceState('/family', url);
  }

  public isOpenFamilyExpandBlock(data: any): void {
    this.openFamilyExpandBlock.next(data);
  }

  public initData(): void {
    if (!this.streetSettings) {
      return;
    }

    const queryParams: UrlParameters = {
      thing: 'Families',
      countries: 'World',
      regions: 'World',
      zoom: '4',
      row: '1',
      lowIncome: this.poor,
      highIncome: this.rich,
      lang: this.languageService.currentLanguage
    };

    if (!this.urlParams.place) {
      this.router.navigate(['/matrix', {queryParams}]);

      this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from Home page', {});

      return;
    }
  }
};
