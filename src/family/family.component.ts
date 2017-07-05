import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppStore } from '../interfaces';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forEach, difference, map, find, chain } from 'lodash';
import {
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  LanguageService,
  DrawDividersInterface
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
  public titles: any = {};
  public openFamilyExpandBlock: Subject<any> = new Subject<any>();
  public placeId: string;
  public urlParams: UrlParamsInterface;
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
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public countriesFilterState: Observable<any>;
  public headerElement: HTMLElement;
  public streetFamilyContainerElement: HTMLElement;
  public shortFamilyInfoContainerElement: HTMLElement;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     familyService: FamilyService,
                     languageService: LanguageService,
                     browserDetectionService: BrowserDetectionService,
                     elementRef: ElementRef,
                     store: Store<AppStore>) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.urlChangeService = urlChangeService;
    this.languageService = languageService;
    this.familyService = familyService;
    this.device = browserDetectionService;
    this.element = elementRef.nativeElement;
    this.store = store;

    this.isDesktop = this.device.isDesktop();

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
    this.countriesFilterState = this.store.select((dataSet: AppStore) => dataSet.countriesFilter);
  }

  public ngAfterViewInit(): void {
    this.headerElement = document.querySelector('.header-content') as HTMLElement;
    this.streetFamilyContainerElement = this.element.querySelector('.street-family-container') as HTMLElement;
    this.shortFamilyInfoContainerElement = this.element.querySelector('.short-family-info-container') as HTMLElement;
  }

  public ngOnInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('THE_WORLD').subscribe((trans: any) => {
      this.theWorldTranslate = trans.toLowerCase();

      this.initData();
    });

    setTimeout(() => {
      this.scrollSubscribe = fromEvent(this.window, 'scroll')
        .debounceTime(10)
        .subscribe(() => {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

          let headerHeight: number = this.headerElement.clientHeight;

          if (scrollTop > 0) {
            // this.headerElement.style.position = 'fixed';
            // this.headerElement.style.top = '0px';

            this.streetFamilyContainerElement.style.position = 'fixed';
            this.streetFamilyContainerElement.style.top = this.headerElement.clientHeight + 'px';
            this.streetFamilyContainerElement.style.zIndex = '999';

            this.familyContainer.nativeElement.style.paddingTop = this.headerElement.clientHeight + 'px';

            this.shortFamilyInfoContainerElement.style.top = '86px';
            this.shortFamilyInfoContainerElement.style.maxHeight = '86px';
            this.shortFamilyInfoContainerElement.style.zIndex = '998';
          } else {
            // this.headerElement.style.position = 'static';

            this.streetFamilyContainerElement.style.position = 'static';
            this.streetFamilyContainerElement.style.top = '0px';
            this.streetFamilyContainerElement.style.zIndex = '0';

            this.familyContainer.nativeElement.style.paddingTop = '0px';

            this.shortFamilyInfoContainerElement.style.maxHeight = '0px';
            this.shortFamilyInfoContainerElement.style.zIndex = '0';
          }

          this.setZoomButtonPosition();
        });
    }, 100);

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: any) => {
        this.placeId = params.place;
        this.activeImageIndex = parseInt(params.activeImage, 10);

        this.urlParams = {
          thing: params.thing ? decodeURI(params.thing) : 'Families',
          countries: params.countries ? decodeURI(params.countries) : 'World',
          regions: params.regions ? decodeURI(params.regions) : 'World',
          zoom: parseInt(params.zoom, 10) || 4,
          row: parseInt(params.row, 10) || 1,
          lowIncome: parseInt(params.lowIncome, 10),
          highIncome: parseInt(params.highIncome, 10)
        };

        this.query = `place=${this.placeId}&thing=${this.urlParams.thing}&countries=${this.urlParams.countries}&regions=${this.urlParams.regions}&zoom=${this.urlParams.zoom}&row=${this.urlParams.row}&lowIncome=${this.urlParams.lowIncome}&highIncome=${this.urlParams.highIncome}`;
        this.query = this.query + this.languageService.getLanguageParam();

        this.familyServiceSetThingSubscribe = this.familyService
          .getThing(`thingName=${this.urlParams.thing}${this.languageService.getLanguageParam()}`)
          .subscribe((res: any) => {
            if (res.err) {
              console.error(res.err);
              return;
            }

            this.thing = res.data;

            this.setZoom(this.urlParams.zoom);

            this.initData();
          });
      });

    if (!isNaN(this.activeImageIndex) && 'scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.homeIncomeData = data;

      this.poor = this.homeIncomeData.poor;
      this.rich = this.homeIncomeData.rich;

      if (!this.locations) {
        return;
      }

      this.initData();
    });

    this.countriesFilterState.subscribe((data: any) => {
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
  }

  public changeZoom(zoom: any): void {
    let prevZoom: number = this.zoom;

    this.zoom = zoom;

    this.query = this.query.replace(/zoom\=\d*/, `zoom=${this.zoom}`);

    this.urlChangeService.replaceState('/family', this.query);

    this.familyMediaComponent.changeZoom(prevZoom);
  }

  public setZoom(zoom: number): void {
    if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
      this.zoom = zoom ? zoom : 4;
    }

    if (!this.isDesktop) {
      this.zoom = 3;
    }
  }

  public setZoomButtonPosition(): void {
    let scrollTop: number = (this.document.body.scrollTop || this.document.documentElement.scrollTop) + this.window.innerHeight;

    let containerHeight: number = this.familyContainer.nativeElement.offsetHeight + 30;

    this.zoomPositionFixed = scrollTop > containerHeight;
  }

  public activeImageOptions(options: {activeImageIndex?: number;}): void {
    let {activeImageIndex} = options;

    if (activeImageIndex === this.activeImageIndex) {
      return;
    }

    let url: string = location.search
      .replace('?', '')
      .replace(/&activeImage\=\d*/, '');

    if (activeImageIndex) {
      this.activeImageIndex = activeImageIndex;
      url = url + `&activeImage=${activeImageIndex}`;
    } else {
      this.activeImageIndex = void 0;
    }

    this.urlChangeService.replaceState('/family', url, true);
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

    let countries = this.getCountriesTitle(this.urlParams.regions.split(','), this.urlParams.countries.split(','));

    /*this.titles = {
      thing: this.thing,
      countries: countries,
      income: this.getIncomeTitle(this.urlParams.lowIncome, this.urlParams.highIncome)
    };*/
  }

  /*public getIncomeTitle(min: number, max: number): string {
    let poor: number = this.homeIncomeData.poor;
    let rich: number = this.homeIncomeData.rich;
    let title: string = 'all incomes';

    if (min > poor && max < rich) {
      title = 'incomes $' + min + ' - $' + max;
    }

    if (min > poor && max === rich) {
      title = 'income over $' + min;
    }
    if (min === poor && max < rich) {
      title = 'income lower $' + max;
    }

    return title;
  }*/

  public findCountryTranslatedName(countries: any[]): any {
    return map(countries, (item: string): any => {
      const findTransName: any = find(this.countries, {originName: item});
      return findTransName ? findTransName.country : item;

    });
  }

  public findRegionTranslatedName(regions: any[]): any {
    return map(regions, (item: string): any => {
      const findTransName: any = find(this.locations, {originRegionName: item});
      return findTransName ? findTransName.region : item;
    });
  }

  public getCountriesTitle(regions: string[], countries: string[]): string {
    let getTranslatedCountries: any;
    let getTranslatedRegions: any;
    let title: string;

    if (countries[0] !== 'World') {
      getTranslatedCountries = this.findCountryTranslatedName(countries);
    }

    if (regions[0] !== 'World') {
      getTranslatedRegions = this.findRegionTranslatedName(regions);
    }

    if (regions[0] === 'World' && countries[0] === 'World') {
      return this.theWorldTranslate;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        title = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        title = getTranslatedCountries.join(' & ');
      }

      return title;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        title = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        let sumCountries: number = 0;
        let getDifference: string[] = [];
        let regionCountries: string[] = [];

        forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.originRegionName) !== -1) {
            regionCountries = regionCountries.concat(map(location.countries, 'country') as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          getDifference = difference(getTranslatedCountries, regionCountries);
        }

        if (getDifference.length) {
          title = getDifference.length === 1 && regions.length === 1 ? getTranslatedRegions[0] + ' & '
          + getDifference[0] : getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
        } else {
          title = getTranslatedRegions.join(' & ');
        }
      }

      return title;
    }

    let concatLocations: string[] = regions.concat(getTranslatedCountries);

    if (concatLocations.length > 2) {
      title = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      title = concatLocations.join(' & ');
    }

    return title;
  }
}
