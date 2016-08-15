import {
  Component,
  OnDestroy,
  OnChanges,
  Inject,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  OnInit,
  NgZone
} from '@angular/core';
import { CountriesFilterPipe } from './countries-filter.pipe';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, Subscriber } from 'rxjs';
import { Config } from '../../app.config';

let _ = require('lodash');

let tpl = require('./countries-filter.template.html');
let style = require('./countries-filter.css');

@Component({
  selector: 'countries-filter',
  template: tpl,
  styles: [style],
  pipes: [CountriesFilterPipe]
})

export class CountriesFilterComponent implements OnInit, OnDestroy, OnChanges {
  protected activeCountries: string;
  protected showSelected: boolean;
  protected locations: any[];
  protected isOpenCountriesFilter: boolean = false;
  protected selectedRegions: string[] = [];
  protected selectedCountries: string[] = [];
  protected positionLeft: number = 0;
  @Input()
  private url: string;
  @Output()
  private selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  private countriesFilterService: any;
  private countriesFilterServiceSubscribe: Subscriber<any>;

  private cloneSelectedRegions: string[] = ['World'];
  private cloneSelectedCountries: string[] = ['World'];

  private element: ElementRef;
  private zone: NgZone;
  private resizeSubscribe: Subscription;

  public constructor(@Inject('CountriesFilterService') countriesFilterService: any,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject(NgZone) zone: NgZone) {
    this.countriesFilterService = countriesFilterService;
    this.element = element;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.setPosition();
        });
      });
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: Event): void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenCountriesFilter) {
      this.openCloseCountriesFilter(true);
    }
  }

  protected openCloseCountriesFilter(isOpenCountriesFilter: boolean): void {
    this.isOpenCountriesFilter = !isOpenCountriesFilter;

    this.showSelected = !(this.selectedCountries.length || this.selectedRegions.length);

    if (this.isOpenCountriesFilter) {
      this.setPosition();

      setTimeout(() => {
        this.element.nativeElement.querySelector('.autofocus').focus();
      });
    }

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
  }

  protected cancelCountriesFilter(): void {
    this.openCloseCountriesFilter(true);
  }

  protected clearAllCountries(): void {
    this.showSelected = true;
    this.selectedRegions.length = 0;
    this.selectedCountries.length = 0;
  }

  protected selectRegions(location: any): void {
    this.showSelected = false;

    let index = this.selectedRegions.indexOf(location.region);
    let getEmptyCountries = _.map(location.countries, 'empty');
    let uniqEmptyCountries = _.uniq(getEmptyCountries);

    if (uniqEmptyCountries.length === 1 && uniqEmptyCountries[0] === true) {
      return;
    }

    let getCountriesName = _.map(location.countries, 'country');

    if (index !== -1) {
      this.selectedRegions.splice(index, 1);

      this.selectedCountries = _.difference(this.selectedCountries, getCountriesName);

      return;
    }

    this.selectedRegions.push(location.region);

    this.selectedCountries = _.union(this.selectedCountries.concat(getCountriesName));
  }

  protected selectCountries(country: any, region: string): void {
    this.showSelected = false;

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

    let regionObject = _.find(this.locations, {region: region});
    let regionCountries = _.map(regionObject.countries, 'country');

    if (!_.difference(regionCountries, this.selectedCountries).length) {
      this.selectedRegions.push(region);
    }
  }

  protected goToLocation(): void {
    let query = this.parseUrl(this.url);

    query.regions = this.selectedRegions.length ? this.selectedRegions.join(',') : 'World';
    query.countries = this.selectedCountries.length ? this.selectedCountries.join(',') : 'World';

    this.selectedFilter.emit({url: this.objToQuery(query), isCountriesFilter: true});
    this.isOpenCountriesFilter = false;

    this.cloneSelectedCountries = ['World'];
    this.cloneSelectedRegions = ['World'];
  }

  public ngOnDestroy(): void {
    this.countriesFilterServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }
  }

  public ngOnChanges(changes: any): void {
    if (changes.url && changes.url.currentValue) {
      if (this.countriesFilterServiceSubscribe) {
        this.countriesFilterServiceSubscribe.unsubscribe();
        this.countriesFilterServiceSubscribe = void 0;
      }

      this.countriesFilterServiceSubscribe = this
        .countriesFilterService
        .getCountries(this.url)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.locations = res.data;
          this.setTitle(this.url);
        });
    }
  }

  private setTitle(url: string): void {
    let query: any = this.parseUrl(url);

    let regions: string[] = query.regions;
    let countries: string[] = query.countries;

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

    let concatLocations: string[] = regions.concat(countries);

    if (concatLocations.length > 2) {
      this.activeCountries = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
    this.cloneSelectedLocations(regions, countries);
  }

  private cloneSelectedLocations(regions: any[], countries: any[]): void {
    this.cloneSelectedRegions = _.clone(regions);
    this.cloneSelectedCountries = _.clone(countries);
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }

  private setPosition(): void {
    Config.getCoordinates('countries-filter', (data: any) => {
      if (data.left + 787 + 10 > window.innerWidth) {
        this.positionLeft = data.left + 787 - window.innerWidth + 10;
      } else {
        this.positionLeft = 0;
      }
    });
  }
}
