import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { forEach, difference, map } from 'lodash';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../shared/language-selector/language.service';

import { StreetSettingsService, CountriesFilterService, UrlChangeService, Angulartics2GoogleAnalytics } from '../common';

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
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public countriesFilterService: CountriesFilterService;
  public countriesFilterServiceSubscribe: Subscription;
  public locations: any[];
  public activeImageIndex: number;
  public urlChangeService: UrlChangeService;
  public windowHistory: any = history;
  public queryParamsSubscribe: Subscription;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public languageService: LanguageService;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     countriesFilterService: CountriesFilterService,
                     streetSettingsService: StreetSettingsService,
                     urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     translate: TranslateService,
                     languageService: LanguageService) {
    this.translate = translate;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.streetSettingsService = streetSettingsService;
    this.countriesFilterService = countriesFilterService;
    this.urlChangeService = urlChangeService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.languageService.updateLangUrl();

    this.translateGetTheWorldSubscribe = this.translate.get('THE_WORLD').subscribe((res: any) => {
      this.theWorldTranslate = res;
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const noDataTranslation = event.translations;
      this.theWorldTranslate = noDataTranslation.THE_WORLD;
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
      .getCountries(`thing=${this.urlParams.thing}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.locations = res.data;

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

    let countries = 'the world' ? this.theWorldTranslate : this.getCountriesTitle(this.urlParams.regions.split(','), this.urlParams.countries.split(','));

    this.titles = {
      thing: this.urlParams.thing,
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

  public getCountriesTitle(regions: string[], countries: string[]): string {
    let title: string;
    if (regions[0] === 'World' && countries[0] === 'World') {
      return 'the world';
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        title = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
      } else {
        title = countries.join(' & ');
      }

      return title;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        title = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
      } else {
        let sumCountries: number = 0;
        let getDifference: string[] = [];
        let regionCountries: string[] = [];

        forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.region) !== -1) {
            regionCountries = regionCountries.concat(map(location.countries, 'country') as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          getDifference = difference(countries, regionCountries);
        }

        if (getDifference.length) {
          title = getDifference.length === 1 && regions.length === 1 ? regions[0] + ' & '
          + getDifference[0] : countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
        } else {
          title = regions.join(' & ');
        }
      }

      return title;
    }

    let concatLocations: string[] = regions.concat(countries);

    if (concatLocations.length > 2) {
      title = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      title = concatLocations.join(' & ');
    }

    return title;
  }
}
