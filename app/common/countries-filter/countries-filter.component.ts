import {
  Component,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  OnInit,
  NgZone
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, Observable } from 'rxjs';
import { Config } from '../../app.config';
import * as _ from 'lodash';
import { CountriesFilterService } from './countries-filter.service';

let device = require('device.js')();
let isDesktop = device.desktop();

let styleMobile = require('./countries-filter-mobile/countries-filter-mobile.css') as string;
let style = require('./countries-filter.css') as string;

@Component({
  selector: 'countries-filter',
  template: require('./countries-filter.template.html') as string,
  styles: [style, styleMobile]
})

export class CountriesFilterComponent implements OnInit, OnDestroy, OnChanges {
  protected isDesktop: boolean = isDesktop;
  protected activeCountries: string;
  protected showSelected: boolean;
  protected locations: any[];
  protected countries: any[];
  protected search: string = '';
  protected isOpenCountriesFilter: boolean = false;
  protected regionsVisibility: boolean = true;
  protected selectedRegions: string[] = [];
  protected selectedCountries: string[] = [];
  protected positionLeft: number = 0;
  protected filterTopDistance: number = 0;
  @Input()
  private url: string;

  @Output('isFilterGotData')
  private isFilterGotData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  private countriesFilterService: CountriesFilterService;
  private countriesFilterServiceSubscribe: Subscription;

  private cloneSelectedRegions: string[] = ['World'];
  private cloneSelectedCountries: string[] = ['World'];

  private element: HTMLElement;
  private zone: NgZone;
  private resizeSubscribe: Subscription;
  private keyUpSubscribe: Subscription;
  private openMobileFilterView: boolean = false;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     countriesFilterService: CountriesFilterService) {
    this.countriesFilterService = countriesFilterService;
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.isOpenMobileFilterView();

    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.setPosition();
          this.isOpenMobileFilterView();
        });
      });
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenCountriesFilter) {

      this.openCloseCountriesFilter(true);
    }
  }

  protected hideRegionsIfInFocus(regionsVisibility: boolean): void {
    this.regionsVisibility = !regionsVisibility;
  }

  protected hideRegions(isShown: boolean): void {
    let tabContent = this.element.querySelector('.underline-k') as HTMLElement;

    if (isShown && tabContent) {
      this.regionsVisibility = false;
      setTimeout(() => {
        if (this.keyUpSubscribe) {
          this.keyUpSubscribe.unsubscribe();
        }

        let inputElement = this.element.querySelector('.form-control') as HTMLInputElement;
        this.keyUpSubscribe = fromEvent(inputElement, 'keyup')
          .subscribe((e: KeyboardEvent) => {
            if (e.keyCode === 13) {
              this.regionsVisibility = true;
              inputElement.blur();
            }
          });
      }, 0);
      return;
    }
    this.regionsVisibility = true;
  }

  protected openCloseCountriesFilter(isOpenCountriesFilter: boolean): void {
    this.isOpenCountriesFilter = !isOpenCountriesFilter;
    this.search = '';
    this.regionsVisibility = true;

    if (this.isOpenCountriesFilter && !isDesktop) {
      let tabContent = this.element.querySelector('.countries-container') as HTMLElement;
      let inputElement = this.element.querySelector('.form-control') as HTMLInputElement;

      this.keyUpSubscribe = fromEvent(inputElement, 'keyup')
        .subscribe((e: KeyboardEvent) => {
          if (e.keyCode === 13) {
            inputElement.blur();
          }
        });

      if (tabContent) {
        setTimeout(() => {
          tabContent.scrollTop = 0;
        }, 0);
      }
    }

    this.showSelected = !(this.selectedCountries.length || this.selectedRegions.length);

    if (this.isOpenCountriesFilter) {
      this.setPosition();

      setTimeout(() => {
        if (isDesktop && !this.openMobileFilterView) {
          (this.element.querySelector('.autofocus') as HTMLInputElement).focus();
        }

        this.isOpenMobileFilterView();
      }, 0);
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

      this.openMobileFilterView = window.innerWidth < 1024 || !isDesktop;
    }
  }

  protected cancelCountriesFilter(): void {
    this.openCloseCountriesFilter(true);
  }

  protected clearAllCountries(): void {
    this.showSelected = true;
    this.regionsVisibility = true;
    this.selectedRegions.length = 0;
    this.selectedCountries.length = 0;
    this.search = '';
  }

  protected selectRegions(location: any): void {
    this.showSelected = false;
    this.search = '';

    let index = this.selectedRegions.indexOf(location.region);
    let getEmptyCountries = _.map(location.countries, 'empty');
    let uniqEmptyCountries = _.uniq(getEmptyCountries);

    if (uniqEmptyCountries.length === 1 && uniqEmptyCountries[0] === true) {
      return;
    }

    let getCountriesName = _.map(location.countries, 'country') as string[];

    if (index !== -1) {
      this.selectedRegions.splice(index, 1);

      this.selectedCountries = _.difference(this.selectedCountries, getCountriesName) as string[];

      return;
    }

    this.selectedRegions.push(location.region);

    this.selectedCountries = _.union(this.selectedCountries.concat(getCountriesName));
  }

  protected selectCountries(country: any, region: string): void {
    this.showSelected = false;
    this.regionsVisibility = true;

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

    this.search = '';
    this.regionsVisibility = true;

    query.regions = this.selectedRegions.length ? this.selectedRegions.join(',') : 'World';
    query.countries = this.selectedCountries.length ? this.selectedCountries.join(',') : 'World';

    this.selectedFilter.emit({url: this.objToQuery(query), isCountriesFilter: true});
    this.isOpenCountriesFilter = false;

    this.cloneSelectedCountries = ['World'];
    this.cloneSelectedRegions = ['World'];
    this.openMobileFilterView = window.innerWidth < 1024 || !isDesktop;
  }

  public ngOnDestroy(): void {
    this.countriesFilterServiceSubscribe.unsubscribe();

    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }
  }

  public ngOnChanges(changes: any): void {
    this.search = '';

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

          this.countries = _
            .chain(res.data)
            .map('countries')
            .flatten()
            .sortBy('country')
            .value();

          this.setTitle(this.url);
          this.isFilterGotData.emit('isCountryFilterReady');
        });
    }
  }

  private setTitle(url: string): void {
    let query: any = this.parseUrl(url);

    let regions: string[] = query.regions;
    let countries: string[] = query.countries;

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = 'the World';
      this.selectedCountries.length = 0;
      this.selectedRegions.length = 0;

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
            regionCountries = regionCountries.concat(_.map(location.countries, 'country') as string[]);
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
      this.filterTopDistance = data.top;

      if (data.left + 787 + 10 > window.innerWidth) {
        this.positionLeft = data.left + 787 - window.innerWidth + 10;
      } else {
        this.positionLeft = 0;
      }
    });
  }

  private isOpenMobileFilterView(): void {
    if (window.innerWidth < 1024 || !isDesktop) {
      this.openMobileFilterView = true;
      return;
    }

    let countriesFilterContainer = this.element.querySelector('#countries-filter .countries-filter-container') as HTMLElement;
    let openCountriesFilterContainer = this.element.querySelector('.open-countries-filter') as HTMLElement;

    if (countriesFilterContainer && openCountriesFilterContainer && (window.innerHeight <
      (this.filterTopDistance + countriesFilterContainer.offsetHeight + openCountriesFilterContainer.offsetHeight))) {
      this.openMobileFilterView = true;
    } else {
      this.openMobileFilterView = false;
    }
  }
}
