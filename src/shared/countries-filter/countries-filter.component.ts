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
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { Config } from '../../app.config';
import { BrowserDetectionService, CountriesFilterService } from '../../common';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'countries-filter',
  templateUrl: './countries-filter.component.html',
  styleUrls: ['./countries-filter-mobile/countries-filter-mobile.component.css', './countries-filter.component.css']
})

export class CountriesFilterComponent implements OnInit, OnDestroy, OnChanges {
  public translate: TranslateService;
  public theWorldTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetTheWorldSubscribe: Subscription;

  public activeCountries: string;
  public showSelected: boolean;
  public locations: any[];
  public countries: any[];
  public search: string = '';
  public isOpenCountriesFilter: boolean = false;
  public regionsVisibility: boolean = true;
  public selectedRegions: string[] = [];
  public selectedCountries: string[] = [];
  public positionLeft: number = 0;
  public filterTopDistance: number = 0;
  @Input()
  public url: string;

  @Output('isFilterGotData')
  public isFilterGotData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  public countriesFilterService: CountriesFilterService;
  public countriesFilterServiceSubscribe: Subscription;

  public cloneSelectedRegions: string[] = ['World'];
  public cloneSelectedCountries: string[] = ['World'];

  public element: HTMLElement;
  public zone: NgZone;
  public resizeSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public openMobileFilterView: boolean = false;
  public device: BrowserDetectionService;
  public isDesktop: boolean;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     countriesFilterService: CountriesFilterService,
                     browserDetectionService: BrowserDetectionService,
                     translate: TranslateService) {
    this.translate = translate;
    this.device = browserDetectionService;
    this.countriesFilterService = countriesFilterService;
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.translateGetTheWorldSubscribe = this.translate.get('THE_WORLD').subscribe((res: any) => {
      this.theWorldTranslate = res;
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const noDataTranslation = event.translations;
      this.theWorldTranslate = noDataTranslation.THE_WORLD;
    });

    this.isDesktop = this.device.isDesktop();

    this.isOpenMobileFilterView();

    this.resizeSubscribe = fromEvent(window, 'resize')
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

  public hideRegionsIfInFocus(regionsVisibility: boolean): void {
    this.regionsVisibility = !regionsVisibility;
  }

  public hideRegions(isShown: boolean): void {
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

  public openCloseCountriesFilter(isOpenCountriesFilter: boolean): void {
    this.isOpenCountriesFilter = !isOpenCountriesFilter;
    this.search = '';
    this.regionsVisibility = true;

    if (this.isOpenCountriesFilter && !this.isDesktop) {
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
        if (this.isDesktop && !this.openMobileFilterView) {
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

      this.openMobileFilterView = window.innerWidth < 1024 || !this.isDesktop;
    }
  }

  public cancelCountriesFilter(): void {
    this.openCloseCountriesFilter(true);
  }

  public clearAllCountries(): void {
    this.showSelected = true;
    this.regionsVisibility = true;
    this.selectedRegions.length = 0;
    this.selectedCountries.length = 0;
    this.search = '';
  }

  public selectRegions(location: any): void {
    this.showSelected = false;
    this.search = '';

    let index = this.selectedRegions.indexOf(location.originRegionName);

    let getEmptyCountries = _.map(location.countries, 'empty');
    let uniqEmptyCountries = _.uniq(getEmptyCountries);

    if (uniqEmptyCountries.length === 1 && uniqEmptyCountries[0] === true) {
      return;
    }

    let getCountriesName = _.map(location.countries, 'originName') as string[];

    if (index !== -1) {
      this.selectedRegions.splice(index, 1);

      this.selectedCountries = _.difference(this.selectedCountries, getCountriesName) as string[];

      return;
    }

    this.selectedRegions.push(location.originRegionName);

    this.selectedCountries = _.union(this.selectedCountries.concat(getCountriesName));
  }

  public selectCountries(country: any, originRegionName: string, region: string): void {
    this.showSelected = false;
    this.regionsVisibility = true;

    let indexCountry = this.selectedCountries.indexOf(country.originName);

    if (indexCountry === -1 && country.empty) {
      return;
    }

    let indexRegion = this.selectedRegions.indexOf(originRegionName);

    if (indexCountry !== -1) {
      this.selectedCountries.splice(indexCountry, 1);

      if (indexRegion !== -1) {
        this.selectedRegions.splice(indexRegion, 1);
      }

      return;
    }

    this.selectedCountries.push(country.originName);

    let regionObject = _.find(this.locations, {region});
    let regionCountries = _.map(regionObject.countries, 'originName');
    if (!_.difference(regionCountries, this.selectedCountries).length) {
      this.selectedRegions.push(originRegionName);
    }
  }

  public goToLocation(): void {
    let query = this.parseUrl(this.url);

    this.search = '';
    this.regionsVisibility = true;

    query.regions = this.selectedRegions.length ? this.selectedRegions.join(',') : 'World';
    query.countries = this.selectedCountries.length ? this.selectedCountries.join(',') : 'World';

    this.selectedFilter.emit({url: this.objToQuery(query), isCountriesFilter: true});
    this.isOpenCountriesFilter = false;

    this.cloneSelectedCountries = ['World'];
    this.cloneSelectedRegions = ['World'];
    this.openMobileFilterView = window.innerWidth < 1024 || !this.isDesktop;
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

  public setTitle(url: string): void {
    let query: any = this.parseUrl(url);
    let getTranslatedCountries: any;
    let getTranslatedRegions: any;
    let regions: string[] = query.regions;
    let countries: string[] = query.countries;

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = this.theWorldTranslate;
      this.selectedCountries.length = 0;
      this.selectedRegions.length = 0;

      return;
    }

    if (query.countries[0] !== 'World') {
      getTranslatedCountries = this.findCountryTranslatedName(query.countries);
    }

    if (query.regions[0] !== 'World') {
      getTranslatedRegions = this.findRegionTranslatedName(query.regions);
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        this.activeCountries = getTranslatedCountries.join(' & ');
      }

      this.selectedRegions.length = 0;
      this.selectedCountries = countries;

      this.cloneSelectedLocations(regions, countries);

      return;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.activeCountries = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        let sumCountries: number = 0;
        let difference: string[] = [];
        let regionCountries: string[] = [];

        _.forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.originRegionName) !== -1) {
            regionCountries = regionCountries.concat(_.map(location.countries, 'country') as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          difference = _.difference(getTranslatedCountries, regionCountries);
        }

        if (difference.length) {
          this.activeCountries = difference.length === 1 && regions.length === 1 ? getTranslatedRegions[0] + ' & '
          + difference[0] : getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
        } else {
          this.activeCountries = getTranslatedRegions.join(' & ');
        }
      }

      this.selectedRegions = regions;
      this.selectedCountries = countries;

      this.cloneSelectedLocations(regions, countries);

      return;
    }

    let concatLocations: string[] = regions.concat(getTranslatedCountries);

    if (concatLocations.length > 2) {
      this.activeCountries = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
    this.cloneSelectedLocations(regions, countries);
  }

  public cloneSelectedLocations(regions: any[], countries: any[]): void {
    this.cloneSelectedRegions = _.clone(regions);
    this.cloneSelectedCountries = _.clone(countries);
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  public parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }

  public setPosition(): void {
    Config.getCoordinates('countries-filter', (data: any) => {
      this.filterTopDistance = data.top;

      if (data.left + 787 + 10 > window.innerWidth) {
        this.positionLeft = data.left + 787 - window.innerWidth + 10;
      } else {
        this.positionLeft = 0;
      }
    });
  }

  public isOpenMobileFilterView(): void {
    if (window.innerWidth < 1024 || !this.isDesktop) {
      let pointerContainer = this.element.querySelector('.pointer-container') as HTMLElement;

      let buttonContainer = this.element.querySelector('.button-container') as HTMLElement;

      let shortenWidth = this.element.querySelector('.shorten') as HTMLElement;
      let cancelButton = this.element.querySelector('.cancel') as HTMLElement;
      let okayButton = this.element.querySelector('.okay') as HTMLElement;

      if (pointerContainer) {
        let buttonsContainerWidth = okayButton.offsetWidth + cancelButton.offsetWidth + pointerContainer.offsetWidth;
        if (buttonsContainerWidth && buttonsContainerWidth > buttonContainer.offsetWidth) {
          shortenWidth.classList.add('decreaseFontSize');
          cancelButton.classList.add('decreaseFontSize');
          okayButton.classList.add('decreaseFontSize');
        }
      }

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
