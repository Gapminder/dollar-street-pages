import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { MainMenuComponent } from '../common/menu/menu.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeMediaComponent } from './home-media/home-media.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';
import { Subscriber } from 'rxjs/Rx';

let _ = require('lodash');

let tpl = require('./home.template.html');
let style = require('./home.css');

interface UrlParamsInterface {
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
  template: tpl,
  styles: [style],
  directives: [
    HomeHeaderComponent,
    HomeMediaComponent,
    FooterComponent,
    LoaderComponent,
    ROUTER_DIRECTIVES,
    MainMenuComponent,
    FooterSpaceDirective
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  protected loader: boolean = false;
  protected titles: any = {};

  private placeId: string;
  private urlParams: UrlParamsInterface;
  private homeIncomeFilterService: any;
  private homeIncomeFilterServiceSubscribe: Subscriber;
  private homeIncomeData: any;
  private rich: any;
  private poor: any;
  private router: Router;
  private countriesFilterService: any;
  private countriesFilterServiceSubscribe: Subscriber;
  private locations: any[];
  private activeImageIndex: number;
  private urlChangeService: any;
  private windowHistory: any = history;
  private queryParamsSubscribe: any;

  public constructor(@Inject('CountriesFilterService') countriesFilterService: any,
                     @Inject('HomeIncomeFilterService') homeIncomeFilterService: any,
                     @Inject('UrlChangeService') urlChangeService: any,
                     @Inject(Router) router: Router) {
    this.router = router;
    this.homeIncomeFilterService = homeIncomeFilterService;
    this.countriesFilterService = countriesFilterService;
    this.urlChangeService = urlChangeService;
  }

  public ngOnInit(): void {
    this.queryParamsSubscribe = this.router
      .routerState
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

    this.homeIncomeFilterServiceSubscribe = this.homeIncomeFilterService.getData()
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
    this.homeIncomeFilterServiceSubscribe.unsubscribe();

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }
  }

  protected activeImageOptions(options: {activeImageIndex?: number;}): void {
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

    this.urlChangeService.replaceState('/family', url);
  }

  private initData(): void {
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

      return;
    }

    this.titles = {
      thing: this.urlParams.thing,
      countries: this.getCountriesTitle(this.urlParams.regions.split(','), this.urlParams.countries.split(',')),
      income: this.getIncomeTitle(this.urlParams.lowIncome, this.urlParams.highIncome)
    };

    this.loader = true;
  }

  private getIncomeTitle(min: number, max: number): string {
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

  private getCountriesTitle(regions: string[], countries: string[]): string {
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
        let difference: string[] = [];
        let regionCountries: string[] = [];

        _.forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.region) !== -1) {
            regionCountries = regionCountries.concat(_.map(location.countries, 'country'));
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          difference = _.difference(countries, regionCountries);
        }

        if (difference.length) {
          title = difference.length === 1 && regions.length === 1 ? regions[0] + ' & '
          + difference[0] : countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
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
