import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteParams, RouterLink } from '@angular/router-deprecated';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { MainMenuComponent } from '../common/menu/menu.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeMediaComponent } from './home-media/home-media.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let _ = require('lodash');

let tpl = require('./home.template.html');
let style = require('./home.css');

interface UrlParamsInterface {
  thing:string;
  countries:string;
  regions:string;
  zoom:number;
  row:number;
  lowIncome?:number;
  highIncome?:number;
}

@Component({
  selector: 'home',
  template: tpl,
  styles: [style],
  directives: [
    HomeHeaderComponent,
    HomeMediaComponent,
    FooterComponent,
    LoaderComponent,
    RouterLink,
    MainMenuComponent,
    FooterSpaceDirective
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  protected loader:boolean = false;
  protected titles:any = {};

  private placeId:string;
  private routeParams:RouteParams;
  private urlParams:UrlParamsInterface;
  private homeIncomeFilterService:any;
  private homeIncomeFilterServiceSubscribe:any;
  private homeIncomeData:any;
  private rich:any;
  private poor:any;
  private router:Router;
  private countriesFilterService:any;
  private countriesFilterServiceSubscribe:any;
  private locations:any[];
  private activeImageIndex:number;
  private urlChangeService:any;
  private windowHistory:any = history;

  public constructor(@Inject(RouteParams) routeParams:RouteParams,
                     @Inject('CountriesFilterService') countriesFilterService:any,
                     @Inject('HomeIncomeFilterService') homeIncomeFilterService:any,
                     @Inject('UrlChangeService') urlChangeService:any,
                     @Inject(Router) router:Router) {
    this.routeParams = routeParams;
    this.router = router;
    this.homeIncomeFilterService = homeIncomeFilterService;
    this.countriesFilterService = countriesFilterService;
    this.urlChangeService = urlChangeService;
  }

  public ngOnInit():void {
    this.placeId = this.routeParams.get('place');
    this.activeImageIndex = parseInt(this.routeParams.get('activeImage'), 10);

    if (!isNaN(this.activeImageIndex) && 'scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.urlParams = {
      thing: this.routeParams.get('thing') ? decodeURI(this.routeParams.get('thing')) : 'Home',
      countries: this.routeParams.get('countries') ? decodeURI(this.routeParams.get('countries')) : 'World',
      regions: this.routeParams.get('regions') ? decodeURI(this.routeParams.get('regions')) : 'World',
      zoom: parseInt(this.routeParams.get('zoom'), 10) || 4,
      row: parseInt(this.routeParams.get('row'), 10) || 1,
      lowIncome:  parseInt(this.routeParams.get('lowIncome'), 10) || 0,
      highIncome:  parseInt(this.routeParams.get('highIncome'), 10) || 15000
    };

    this.homeIncomeFilterServiceSubscribe = this.homeIncomeFilterService.getData()
      .subscribe((val:any) => {
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
      .subscribe((res:any):any => {
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

  public ngOnDestroy():void {
    this.countriesFilterServiceSubscribe.unsubscribe();
    this.homeIncomeFilterServiceSubscribe.unsubscribe();

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }
  }

  protected activeImageOptions(options:{activeImageIndex?:number;}):void {
    let {activeImageIndex} = options;

    if (activeImageIndex === this.activeImageIndex) {
      return;
    }

    let url:string = location.search
      .replace('?', '')
      .replace(/&activeImage\=\d*/, '');

    if (activeImageIndex) {
      this.activeImageIndex = activeImageIndex;
      url = url + `&activeImage=${activeImageIndex}`;
    } else {
      this.activeImageIndex = void 0;
    }

    this.urlChangeService.replaceState('/home', url);
  }

  private initData():void {
    this.urlParams.lowIncome = parseInt(this.routeParams.get('lowIncome'), 10) || this.poor;
    this.urlParams.highIncome = parseInt(this.routeParams.get('highIncome'), 10) || this.rich;

    if (!this.placeId) {
      this.router.navigate(['Matrix', {
        thing: 'Home',
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

  private getIncomeTitle(min:number, max:number):string {
    let poor:number = this.homeIncomeData.poor;
    let rich:number = this.homeIncomeData.rich;
    let title:string = 'all incomes';

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

  private getCountriesTitle(regions:string[], countries:string[]):string {
    let title:string;

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
        let sumCountries:number = 0;
        let difference:string[] = [];
        let regionCountries:string[] = [];

        _.forEach(this.locations, (location:any) => {
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

    let concatLocations:string[] = regions.concat(countries);

    if (concatLocations.length > 2) {
      title = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      title = concatLocations.join(' & ');
    }

    return title;
  }
}
