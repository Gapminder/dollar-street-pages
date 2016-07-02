import {Component, OnDestroy, OnChanges, Inject, Input, Output, EventEmitter} from '@angular/core';

let _ = require('lodash');

let tpl = require('./countries-filter.template.html');
let style = require('./countries-filter.css');

@Component({
  selector: 'countries-filter',
  template: tpl,
  styles: [style]
})

export class CountriesFilterComponent implements OnDestroy, OnChanges {
  protected activeCountries:string;
  protected locations:any[];
  protected isOpenCountriesFilter:boolean = false;
  protected selectedRegions:string[] = [];
  protected selectedCountries:string[] = [];
  @Input()
  protected activeFilter:string;
  @Input()
  private url:string;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter();
  @Output()
  private activatedFilter:EventEmitter<any> = new EventEmitter();

  private countriesFilterService:any;
  private countriesFilterServiceSubscribe:any;

  private cloneSelectedRegions:string[] = ['World'];
  private cloneSelectedCountries:string[] = ['World'];

  public constructor(@Inject('CountriesFilterService') countriesFilterService:any) {
    this.countriesFilterService = countriesFilterService;
  }

  protected clearAllCountries():void {
    this.selectedRegions.length = 0;
    this.selectedCountries.length = 0;
    this.cloneSelectedCountries = ['World'];
    this.cloneSelectedCountries = ['World'];
  }

  protected openCloseCountriesFilter(isOpenCountriesFilter:boolean, isOnChanges?:boolean):void {
    this.isOpenCountriesFilter = !isOpenCountriesFilter;

    if (!this.isOpenCountriesFilter) {
      if (this.cloneSelectedRegions[0] !== 'World') {
        this.selectedRegions = _.clone(this.cloneSelectedRegions);
      } else {
        this.selectedRegions.length = 0;
      }

      if (this.cloneSelectedCountries[0] !== 'World') {
        this.selectedCountries = _.clone(this.cloneSelectedCountries);
      } else {
        this.selectedCountries.length = 0;
      }
    }

    if (!isOnChanges) {
      this.activatedFilter.emit(this.isOpenCountriesFilter ? 'countries' : '');
    }
  }

  protected selectRegions(location:any):void {
    let index = this.selectedRegions.indexOf(location.region);
    let getCountriesName = _.map(location.countries, 'country');

    if (index !== -1) {
      this.selectedRegions.splice(index, 1);

      this.selectedCountries = _.difference(this.selectedCountries, getCountriesName);

      return;
    }

    this.selectedRegions.push(location.region);

    this.selectedCountries = _.union(this.selectedCountries.concat(getCountriesName));
  }

  protected selectCountries(country:any, region:string):void {
    let indexCountry = this.selectedCountries.indexOf(country.country);

    if (indexCountry === -1 && country.empty) {
      return;
    }

    let indexRegion = this.selectedRegions.indexOf(region);

    if (indexCountry !== -1) {
      this.selectedCountries.splice(indexCountry, 1);

      if (indexRegion !== -1) {
        this.selectedRegions.splice(indexRegion, 1);
      }

      return;
    }

    this.selectedCountries.push(country.country);
  }

  protected goToLocation():void {
    let query = this.parseUrl(this.url);

    query.regions = this.selectedRegions.length ? this.selectedRegions.join(',') : 'World';
    query.countries = this.selectedCountries.length ? this.selectedCountries.join(',') : 'World';

    this.selectedFilter.emit({url: this.objToQuery(query), isCountriesFilter: true});
    this.isOpenCountriesFilter = false;
  }

  public ngOnDestroy():void {
    this.countriesFilterServiceSubscribe.unsubscribe();
  }

  public ngOnChanges(changes:any):void {
    if (changes.url && changes.url.currentValue) {
      if (this.countriesFilterServiceSubscribe) {
        this.countriesFilterServiceSubscribe.unsubscribe();
        this.countriesFilterServiceSubscribe = void 0;
      }

      this.countriesFilterServiceSubscribe = this
        .countriesFilterService
        .getCountries(this.url)
        .subscribe((res:any) => {
          if (res.err) {
            return res.err;
          }

          this.locations = res.data;
          this.setTitle(this.url);
        });
    }

    if (
      this.isOpenCountriesFilter &&
      changes.activeFilter &&
      changes.activeFilter.currentValue &&
      changes.activeFilter.currentValue !== 'countries'
    ) {
      this.openCloseCountriesFilter(true, true);
    }
  }

  private setTitle(url:string):void {
    let query:any = this.parseUrl(url);

    let regions:string[] = query.regions;
    let countries:string[] = query.countries;

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = 'the world';

      return;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
      } else {
        this.activeCountries = countries.join(' & ');
      }

      this.selectedCountries = countries;

      this.cloneSelectedLocations(regions, countries);

      return;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.activeCountries = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
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
          this.activeCountries = difference.length === 1 && regions.length === 1 ? regions[0] + ' & '
          + difference[0] : countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
        } else {
          this.activeCountries = regions.join(' & ');
        }
      }

      this.selectedRegions = regions;
      this.selectedCountries = countries;

      this.cloneSelectedLocations(regions, countries);

      return;
    }

    let concatLocations:string[] = regions.concat(countries);

    if (concatLocations.length > 2) {
      this.activeCountries = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
    this.cloneSelectedLocations(regions, countries);
  }

  private cloneSelectedLocations(regions:any[], countries:any[]):void {
    this.cloneSelectedRegions = _.clone(regions);
    this.cloneSelectedCountries = _.clone(countries);
  }

  private objToQuery(data:any):string {
    return Object.keys(data).map((k:string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url:string):any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }
}
