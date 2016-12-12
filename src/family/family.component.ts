import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { forEach, difference, map } from 'lodash';
import { TranslateService } from 'ng2-translate';
import {
  StreetSettingsService,
  CountriesFilterService,
  UrlChangeService,
  Angulartics2GoogleAnalytics
} from '../common';
import { LanguageService } from '../shared';
import { FamilyService } from './family.service';

export interface UrlParamsInterface {
  thing: string;
  countries: string;
  regions: string;
  zoom: number;
  row: number;
  lowIncome?: number;
  highIncome?: number;
}

@Component({
  selector: 'family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})

export class FamilyComponent implements OnInit, OnDestroy {
  public translate: TranslateService;
  public theWorldTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetTheWorldSubscribe: Subscription;
  public languageService: LanguageService;

  public streetFamilyData: {income: number, region: string};
  public titles: any = {};
  public openFamilyExpandBlock: Subject<any> = new Subject<any>();
  public placeId: string;
  public urlParams: UrlParamsInterface;
  public streetSettingsService: StreetSettingsService;
  public streetSettingsServiceSubscribe: Subscription;
  public homeIncomeData: any;
  public rich: any;
  public poor: any;
  public thing: any = {};
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public countriesFilterService: CountriesFilterService;
  public countriesFilterServiceSubscribe: Subscription;
  public locations: any[];
  public countries: any[];
  public activeImageIndex: number;
  public urlChangeService: UrlChangeService;
  public windowHistory: any = history;
  public queryParamsSubscribe: Subscription;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public familyService: FamilyService;
  public familyServiceSetThingSubscribe: Subscription;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     countriesFilterService: CountriesFilterService,
                     streetSettingsService: StreetSettingsService,
                     urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     translate: TranslateService,
                     familyService: FamilyService,
                     languageService: LanguageService) {
    this.translate = translate;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.streetSettingsService = streetSettingsService;
    this.countriesFilterService = countriesFilterService;
    this.urlChangeService = urlChangeService;
    this.languageService = languageService;
    this.familyService = familyService;
  }

  public ngOnInit(): void {
    this.translateGetTheWorldSubscribe = this.translate.get('THE_WORLD').subscribe((res: any) => {
      this.theWorldTranslate = res.toLowerCase();
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const dataTranslation = event.translations;
      this.theWorldTranslate = dataTranslation.THE_WORLD.toLowerCase();
      this.initData();
    });

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

        this.familyServiceSetThingSubscribe = this.familyService
          .getThing(`thingName=${this.urlParams.thing}${this.languageService.getLanguageParam()}`)
          .subscribe((res: any) => {
            if (res.err) {
              console.error(res.err);
              return;
            }

            this.thing = res.data;
            this.initData();
          });
      });

    if (!isNaN(this.activeImageIndex) && 'scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.streetSettingsServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.homeIncomeData = val.data;

        this.poor = this.homeIncomeData.poor;
        this.rich = this.homeIncomeData.rich;

        if (!this.locations) {
          return;
        }

        this.initData();
      });

    this.countriesFilterServiceSubscribe = this.countriesFilterService
      .getCountries(`thing=${this.urlParams.thing}${this.languageService.getLanguageParam()}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.locations = res.data;
        this.countries = _
          .chain(res.data)
          .map('countries')
          .flatten()
          .sortBy('country')
          .value();

        if (!this.homeIncomeData) {
          return;
        }

        this.initData();
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
    this.countriesFilterServiceSubscribe.unsubscribe();
    this.streetSettingsServiceSubscribe.unsubscribe();
    this.translateGetTheWorldSubscribe.unsubscribe();
    this.translateOnLangChangeSubscribe.unsubscribe();
    this.familyServiceSetThingSubscribe.unsubscribe();

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }
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

    this.titles = {
      thing: this.thing,
      countries: countries,
      income: this.getIncomeTitle(this.urlParams.lowIncome, this.urlParams.highIncome)
    };
  }

  public getIncomeTitle(min: number, max: number): string {
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
  }

  public findCountryTranslatedName(countries: any[]): any {
    return _.map(countries, (item: string): any => {
      const findTransName: any = _.find(this.countries, {originName: item});
      return findTransName ? findTransName.country : item;

    });
  }

  public findRegionTranslatedName(regions: any[]): any {
    return _.map(regions, (item: string): any => {
      const findTransName: any = _.find(this.locations, {originRegionName: item});
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
