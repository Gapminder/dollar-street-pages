import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forEach, difference, map, find, chain } from 'lodash';
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
  public languageService: LanguageService;
  public window: Window = window;
  public document: Document = document;
  public streetFamilyData: {income: number, region: string};
  public zoom: number;
  public openFamilyExpandBlock: Subject<any> = new Subject<any>();
  public placeId: string;
  public urlParams: any;
  public homeIncomeData: any;
  public rich: any;
  public poor: any;
  public thing: any = {};
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public locations: any[];
  public countries: any[];
  public activeImageIndex: number;
  public urlChangeService: UrlChangeService;
  public windowHistory: any = history;
  public queryParamsSubscribe: Subscription;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public familyService: FamilyService;
  public familyServiceSetThingSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;
  public scrollSubscribe: Subscription;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public zoomPositionFixed: boolean;
  public element: HTMLElement;
  public query: string;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public countriesFilterState: Observable<any>;
  public headerElement: HTMLElement;
  public streetFamilyContainerElement: HTMLElement;
  public shortFamilyInfoContainerElement: HTMLElement;
  public streetSettingsStateSubscription: Subscription;
  public countriesFilterStateSubscription: Subscription;
  public itemSize: number;
  public row: number;
  public rowEtalon: number;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     familyService: FamilyService,
                     languageService: LanguageService,
                     browserDetectionService: BrowserDetectionService,
                     elementRef: ElementRef,
                     private store: Store<AppStates>,
                     private utilsService: UtilsService,
                     private changeDetectorRef: ChangeDetectorRef) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.urlChangeService = urlChangeService;
    this.languageService = languageService;
    this.familyService = familyService;
    this.device = browserDetectionService;
    this.element = elementRef.nativeElement;

    this.isDesktop = this.device.isDesktop();

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.countriesFilterState = this.store.select((appStates: AppStates) => appStates.countriesFilter);
  }

  public ngOnInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('THE_WORLD').subscribe((trans: any) => {
      this.theWorldTranslate = trans.toLowerCase();

      this.initData();
    });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.placeId = params.place;

      this.urlParams = {
        thing: params.thing ? decodeURI(params.thing) : 'Families',
        countries: params.countries ? decodeURI(params.countries) : 'World',
        regions: params.regions ? decodeURI(params.regions) : 'World',
        zoom: parseInt(params.zoom, 10) || 4,
        row: parseInt(params.row, 10) || 1,
        lowIncome: parseInt(params.lowIncome, 10),
        highIncome: parseInt(params.highIncome, 10),
        place: this.placeId,
        lang: this.languageService.currentLanguage
      };

      if (this.urlParams.activeImage) {
        this.urlParams.activeImage = this.urlParams.activeImage;

        this.activeImageIndex = this.urlParams.activeImage;
      }

      this.urlChangeService.replaceState('/family', this.utilsService.objToQuery(this.urlParams));
      this.query = this.utilsService.objToQuery(this.urlParams);

      this.row = this.urlParams.row;
      this.setZoom(this.urlParams.zoom);

      setTimeout(() => {
        if (this.row > 1 && !this.activeImageIndex) {
          this.familyMediaComponent.goToRow(this.row);
        }
      }, 1000);

      let query: string = `thingName=${this.urlParams.thing}${this.languageService.getLanguageParam()}`;
      this.familyServiceSetThingSubscribe = this.familyService
        .getThing(query)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.thing = res.data;

          this.initData();
        });
      });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          this.query = data.query;
        }
      }
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      if(data) {
        this.homeIncomeData = data;

        this.poor = this.homeIncomeData.poor;
        this.rich = this.homeIncomeData.rich;

        if (!this.locations) {
          return;
        }

        this.initData();
      }
    });

    this.countriesFilterStateSubscription = this.countriesFilterState.subscribe((data: any) => {
        if (!data) {
          // this.store.dispatch(this.countriesFilterActions.getCountriesFilter(`thing=${this.urlParams.thing}${this.languageService.getLanguageParam()}`));
        } else {
          this.locations = data;

          this.countries = chain(data)
            .map('countries')
            .flatten()
            .sortBy('country')
            .value();

          this.initData();
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
    if(this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if(this.familyServiceSetThingSubscribe) {
      this.familyServiceSetThingSubscribe.unsubscribe();
    }

    if(this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if(this.scrollSubscribe) {
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

  public changeZoom(zoom: any): void {
    let prevZoom: number = this.zoom;

    this.zoom = zoom;

    this.query = this.query.replace(/zoom\=\d*/, `zoom=${this.zoom}`).replace(/row\=\d*/, `row=${this.row}`);

    this.urlChangeService.replaceState('/family', this.query);

    this.familyMediaComponent.changeZoom(prevZoom);
  }

  public processScroll(): void {
    let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop); //- this.guidePositionTop;

    let distance = scrollTop / this.itemSize;

    if (isNaN(distance)) {
      return;
    }

    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.row = row + 1;

    if (this.rowEtalon !== this.row) {
      this.rowEtalon = this.row;

      if (this.query) {
        let query = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;

        this.query = query;

        this.urlChangeService.replaceState('/family', this.query);
      }
    }
  }

  public applyStyles(): void {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

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
      let offsetHeight: number = this.headerElement.clientHeight + this.streetFamilyContainerElement.clientHeight;

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
    let familyThingsContainerElement: HTMLElement = this.element.querySelector('.family-things-container') as HTMLElement;
    let familyImageContainerElement: HTMLElement = this.element.querySelector('.family-image-container') as HTMLElement;

    if (!familyThingsContainerElement || !familyImageContainerElement) {
      return;
    }

    let widthScroll: number = window.innerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(familyImageContainerElement).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(familyThingsContainerElement).getPropertyValue('padding-left');

    let imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    let imageHeight = (familyThingsContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - imageMargin;

    this.itemSize = imageHeight + imageMargin;
  }

  public setZoomButtonPosition(): void {
    let scrollTop: number = (this.document.body.scrollTop || this.document.documentElement.scrollTop) + this.window.innerHeight;

    let containerHeight: number = this.familyContainer.nativeElement.offsetHeight + 30;

    this.zoomPositionFixed = scrollTop > containerHeight;
  }

  public activeImageOptions(options: any): void {
    let {row, activeImageIndex} = options;

    let queryParams = this.utilsService.parseUrl(this.query);

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

    this.query = this.utilsService.objToQuery(queryParams);

    this.urlChangeService.replaceState('/family', this.query);
  }

  public isOpenFamilyExpandBlock(data: any): void {
    this.openFamilyExpandBlock.next(data);
  }

  public initData(): void {
    if (!this.homeIncomeData) {
      return;
    }

    this.urlParams.lowIncome = this.urlParams.lowIncome || this.poor;
    this.urlParams.highIncome = this.urlParams.highIncome || this.rich;

    if (!this.placeId) {
      this.router.navigate(['/matrix', {
        thing: 'Families',
        countries: 'World',
        regions: 'World',
        zoom: 4,
        row: 1,
        lowIncome: this.poor,
        highIncome: this.rich
      }]);

      this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from Home page', {});

      return;
    }
  }
}
