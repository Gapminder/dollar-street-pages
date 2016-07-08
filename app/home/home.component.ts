import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, RouteParams, RouterLink } from '@angular/router-deprecated';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { FooterComponent } from '../common/footer/footer.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { MainMenuComponent } from '../common/menu/menu.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeMediaComponent } from './home-media/home-media.component';

let _ = require('lodash');

let tpl = require('./home.template.html');
let style = require('./home.css');

interface UrlParamsInterfase {
  thing:string;
  countries:string;
  regions:string;
  zoom:number;
  row:number;
  lowIncome:number;
  highIncome:number;
}

@Component({
  selector: 'home',
  template: tpl,
  styles: [style],
  directives: [HomeHeaderComponent, HomeMediaComponent, FooterComponent, LoaderComponent, RouterLink, MainMenuComponent]
})

export class HomeComponent implements OnInit, OnDestroy {
  protected loader:boolean = false;
  protected titles:any = {};
  protected familyData:any = {};
  protected headerMenuPosition:number = -60;

  private placeId:string;
  private routeParams:RouteParams;
  private urlParams:UrlParamsInterfase;
  private homeIncomeFilterService:any;
  private homeIncomeFilterServiceSubscribe:any;
  private homeIncomeData:any;
  private rich:any;
  private poor:any;
  private router:Router;
  private countriesFilterService:any;
  private countriesFilterServiceSubscribe:any;
  private locations:any[];
  private zone:NgZone;
  private scrollSubscribe:any;

  public constructor(@Inject(RouteParams) routeParams:RouteParams,
                     @Inject('CountriesFilterService') countriesFilterService:any,
                     @Inject('HomeIncomeFilterService') homeIncomeFilterService:any,
                     @Inject(NgZone) zone:NgZone,
                     @Inject(Router) router:Router) {
    this.routeParams = routeParams;
    this.zone = zone;
    this.router = router;
    this.homeIncomeFilterService = homeIncomeFilterService;
    this.countriesFilterService = countriesFilterService;
  }

  public ngOnInit():void {
    this.placeId = this.routeParams.get('place');

    if (!this.placeId) {
      this.router.navigate(['Matrix', {
        thing: 'Home',
        countries: 'World',
        regions: 'World',
        zoom: 4,
        row: 1,
        lowIncome: 0,
        highIncome: 15000
      }]);

      return;
    }

    this.homeIncomeFilterServiceSubscribe = this.homeIncomeFilterService.getData()
      .subscribe((val:any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }
        this.homeIncomeData = val.data;
      });
    if (this.homeIncomeData) {
      this.poor = this.homeIncomeData.poor;
      this.rich = this.homeIncomeData.rich;
    }
    if (!this.homeIncomeData) {
      this.poor = 0;
      this.rich = 15000;
    }

    this.urlParams = {
      thing: this.routeParams.get('thing') ? decodeURI(this.routeParams.get('thing')) : 'Home',
      countries: this.routeParams.get('countries') ? decodeURI(this.routeParams.get('countries')) : 'World',
      regions: this.routeParams.get('regions') ? decodeURI(this.routeParams.get('regions')) : 'World',
      zoom: parseInt(this.routeParams.get('zoom'), 10) || 4,
      row: parseInt(this.routeParams.get('row'), 10) || 1,
      lowIncome: parseInt(this.routeParams.get('lowIncome'), 10) || this.poor,
      highIncome: parseInt(this.routeParams.get('highIncome'), 10) || this.rich
    };

    this.countriesFilterServiceSubscribe = this.countriesFilterService
      .getCountries(`thing=${this.urlParams.thing}`)
      .subscribe((res:any):any => {
        if (res.err) {
          return res.err;
        }

        this.locations = res.data;

        this.titles = {
          thing: this.urlParams.thing,
          countries: this.getCountriesTitle(this.urlParams.regions.split(','), this.urlParams.countries.split(',')),
          income: this.getIncomeTitle(this.urlParams.lowIncome, this.urlParams.highIncome)
        };

        this.loader = true;
      });

    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        this.zone.run(() => {
          if (scrollTop > 100) {
            this.headerMenuPosition = 0;
          } else {
            this.headerMenuPosition = -60;
          }
        });
      });
  }

  public ngOnDestroy():void {
    this.countriesFilterServiceSubscribe.unsubscribe();

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  protected getFamilyData(familyData:any):void {
    this.familyData = familyData;
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
