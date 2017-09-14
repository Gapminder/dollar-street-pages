import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
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
  NgZone,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { chain, clone, difference, union, filter, find, map, forEach, omit } from 'lodash';
import {
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import * as AppActions from '../../app/ngrx/app.actions';
import * as CountriesFilterActions from './ngrx/countries-filter.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { KeyCodes } from '../../enums';

@Component({
  selector: 'countries-filter',
  templateUrl: './countries-filter.component.html',
  styleUrls: ['./countries-filter.component.mobile.css', './countries-filter.component.css']
})
export class CountriesFilterComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('underlineK')
  public underlineK: ElementRef;
  @ViewChild('countriesSearch')
  public countriesSearch: ElementRef;
  @ViewChild('countriesMobileSearch')
  public countriesMobileSearch: ElementRef;
  @ViewChild('countriesMobileContainer')
  public countriesMobileContainer: ElementRef;

  @Output()
  public isFilterGotData: EventEmitter<any> = new EventEmitter<any>();

  public query: string;
  public theWorldTranslate: string;
  public languageService: LanguageService;
  public utilsService: UtilsService;
  public window: Window = window;
  public sliceCount: number;
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
  public getTranslationSubscribe: Subscription;
  public cloneSelectedRegions: string[] = ['World'];
  public cloneSelectedCountries: string[] = ['World'];
  public element: HTMLElement;
  public zone: NgZone;
  public resizeSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public orientationChange: Subscription;
  public openMobileFilterView: boolean = false;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isTablet: boolean;
  public isMobile: boolean;
  public countriesFilterState: Observable<any>;
  public isInit: boolean;
  public countriesFilterStateSubscription: Subscription;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     browserDetectionService: BrowserDetectionService,
                     languageService: LanguageService,
                     utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private urlChangeService: UrlChangeService,
                     private changeDetectorRef: ChangeDetectorRef) {
    this.languageService = languageService;
    this.device = browserDetectionService;
    this.utilsService = utilsService;

    this.element = element.nativeElement;
    this.zone = zone;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.countriesFilterState = this.store.select((appStates: AppStates) => appStates.countriesFilter);
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();
    this.isMobile = this.device.isMobile();
    this.isTablet = this.device.isTablet();

    this.getTranslationSubscribe = this.languageService.getTranslation('THE_WORLD').subscribe((trans: any) => {
      this.theWorldTranslate = trans;

      if(!this.activeCountries) {
        this.activeCountries = this.theWorldTranslate;
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          this.query = data.query;

          this.setTitle(this.query);
        }
      }
    });

    this.countriesFilterStateSubscription = this.countriesFilterState.subscribe((data: any) => {
      if (data) {
        if (data.countriesFilter) {
          this.locations = data.countriesFilter;

          this.countries = chain(this.locations)
            .map('countries')
            .flatten()
            .sortBy('country')
            .value();

          this.isFilterGotData.emit('isCountryFilterReady');
        }
      }
    });

    this.isOpenMobileFilterView();

    this.calcSliceCount();

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.setPosition();
          this.isOpenMobileFilterView();

          this.calcSliceCount();
          this.setTitle(this.query);
        });
      });

    this.orientationChange = fromEvent(window, 'orientationchange')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.calcSliceCount();
          this.setTitle(this.query);
        });
      });
  }

  public ngOnDestroy(): void {
    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.orientationChange) {
      this.orientationChange.unsubscribe();
    }

    if (this.countriesFilterStateSubscription) {
      this.countriesFilterStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
  }

  public ngOnChanges(changes: any): void {
    this.search = '';

    if (changes.url && changes.url.currentValue) {
      if(!this.isInit) {
        this.isInit = true;

        this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(changes.url.currentValue));
      }

      this.setTitle(changes.url.currentValue);
    }
  }

  public calcSliceCount(): void {
    if (this.isMobile) {
      this.sliceCount = 1;
    }

    if (this.isTablet) {
      if (this.window.innerWidth < 610) {
        this.sliceCount = 1;
      } else {
        this.sliceCount = 1;
      }
    }

    if (this.isDesktop) {
      if (this.window.innerWidth < 920) {
        this.sliceCount = 1;
      } else {
        this.sliceCount = 2;
      }
    }
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
    let tabContent: HTMLElement = this.underlineK.nativeElement;

    if (isShown && tabContent) {
      this.regionsVisibility = false;
      setTimeout(() => {
        if (this.keyUpSubscribe) {
          this.keyUpSubscribe.unsubscribe();
        }

        let inputElement: HTMLInputElement = this.countriesMobileSearch.nativeElement;

        this.keyUpSubscribe = fromEvent(inputElement, 'keyup')
          .subscribe((e: KeyboardEvent) => {
            if (e.keyCode === KeyCodes.enter) {
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

    this.showSelected = !(this.selectedCountries.length || this.selectedRegions.length);

    let regionsContainerElementList: NodeListOf<HTMLElement> = this.element.querySelectorAll('.countries-container') as NodeListOf<HTMLElement>;

    if (this.isOpenCountriesFilter) {
      this.utilsService.getCoordinates('things-filter', (data: any) => {
        this.filterTopDistance = data.top;

        setTimeout(() => {
          this.isOpenMobileFilterView();
        }, 0);
      });

      for(let i = 0; i < regionsContainerElementList.length; i++) {
        let regionsContainerElement = regionsContainerElementList[i];

          regionsContainerElement.addEventListener('mousewheel', (e) => {
          let whellDir: string = e.wheelDelta < 0 ? 'down' : 'up';

          let deltaHeight: number = regionsContainerElement.scrollHeight - regionsContainerElement.offsetHeight;

          if (whellDir === 'up' && regionsContainerElement.scrollTop === 0) {
            e.preventDefault();
            e.stopPropagation();
          }

          if (whellDir === 'down' && regionsContainerElement.scrollTop >= deltaHeight) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, false);
      }
    }

    if (this.isOpenCountriesFilter && !this.isDesktop) {
      setTimeout(() => {
        let tabContent: HTMLElement = this.countriesMobileContainer.nativeElement;
        let inputElement: HTMLElement = this.countriesMobileSearch.nativeElement;

        this.keyUpSubscribe = fromEvent(inputElement, 'keyup').subscribe((e: KeyboardEvent) => {
          if (e.keyCode === KeyCodes.enter) {
            inputElement.blur();
          }
        });

        if (tabContent) {
          tabContent.scrollTop = 0;
        }
      }, 0);
    }

    if (this.isOpenCountriesFilter) {
      this.setPosition();

      setTimeout(() => {
        if (this.isDesktop && !this.openMobileFilterView) {
          this.countriesSearch.nativeElement.focus();
        }

        this.isOpenMobileFilterView();
      }, 0);
    }

    if (!this.isOpenCountriesFilter) {
      if (this.cloneSelectedRegions[0] !== 'World') {
        this.selectedRegions = clone(this.cloneSelectedRegions);
      } else {
        this.selectedRegions.length = 0;
      }

      if (this.cloneSelectedCountries[0] !== 'World') {
        this.selectedCountries = clone(this.cloneSelectedCountries);
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

    let getCountriesNames: string[] = map(location.countries, (country: any)=> {
        return country.empty !== true ? country.originName : undefined;
    });

    getCountriesNames = filter(getCountriesNames, (name: any)=> {
      return name !== undefined ? true : false;
    });

    let indexRegion: number = this.selectedRegions.indexOf(location.originRegionName);

    if (indexRegion !== -1) {
      this.selectedRegions.splice(indexRegion, 1);

      this.selectedCountries = difference(this.selectedCountries, getCountriesNames) as string[];

      this.showSelected = !(this.selectedCountries.length || this.selectedRegions.length);

      return;
    }

    this.selectedRegions.push(location.originRegionName);

    this.selectedCountries = union(this.selectedCountries.concat(getCountriesNames));
  }

  public selectCountries(country: any, originRegionName: string, region: string): void {
    const showSelected = this.showSelected;

    this.showSelected = false;
    this.regionsVisibility = true;

    let indexCountry = this.selectedCountries.indexOf(country.originName);
    let indexRegion = this.selectedRegions.indexOf(originRegionName);

    if (indexCountry === -1 && country.empty) {
      this.showSelected = showSelected ? true : false;
      return;
    }

    if (indexCountry !== -1) {
      this.selectedCountries.splice(indexCountry, 1);

      if (indexRegion !== -1) {
        this.selectedRegions.splice(indexRegion, 1);
      }

      this.showSelected = !(this.selectedCountries.length || this.selectedRegions.length);

      return;
    }

    this.selectedCountries.push(country.originName);

    let regionObject = find(this.locations, {region});

    let filtetredRegionCountries = filter(regionObject.countries, (currentCountry: any) => {
      return currentCountry.empty !== true;
    });

    let regionCountries = map(filtetredRegionCountries, 'originName');

    if (!difference(regionCountries, this.selectedCountries).length) {
      this.selectedRegions.push(originRegionName);
    }
  }

  public goToLocation(): void {
    let query = this.utilsService.parseUrl(this.query);

    this.search = '';
    this.regionsVisibility = true;

    query.regions = this.selectedRegions.length ? this.selectedRegions.join(',') : 'World';
    query.countries = this.selectedCountries.length ? this.selectedCountries.join(',') : 'World';

    const queryUrl: string = this.utilsService.objToQuery(query);

    this.setTitle(queryUrl);
    this.changeDetectorRef.detectChanges();

    this.store.dispatch(new AppActions.SetQuery(queryUrl));

    this.store.dispatch(new CountriesFilterActions.SetSelectedCountries(query.countries));
    this.store.dispatch(new CountriesFilterActions.SetSelectedRegions(query.regions));
    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));

    this.store.dispatch(new MatrixActions.UpdateMatrix(true));

    this.urlChangeService.replaceState('/matrix', queryUrl);

    this.isOpenCountriesFilter = false;
    this.cloneSelectedCountries = ['World'];
    this.cloneSelectedRegions = ['World'];
    this.openMobileFilterView = window.innerWidth < 1024 || !this.isDesktop;
  }

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

  public setTitle(url: string): void {
    let query: any = this.utilsService.parseUrl(url);

    let regions: string[] = query.regions;
    let countries: string[] = query.countries;

    let resultCountriesNames: string[] = [];
    let resultRegionsCountries: any = {};

    forEach(this.locations, (location: any) => {
      let currentRegionName: string = location.originRegionName;

      let filteredCountries: any[] = [];

      filteredCountries = filter(location.countries, (country: any) => {
        return country.empty !== true && countries.indexOf(country.originName) !== -1 ? true : false;
      });

      forEach(filteredCountries, (country: any) => {
        let originCountryName: string = country.originName;

        if (regions.indexOf(currentRegionName) !== -1) {
          if (resultRegionsCountries[currentRegionName] === undefined) {
            resultRegionsCountries[currentRegionName] = [];
          }

          resultRegionsCountries[currentRegionName].push(originCountryName);
        }

        resultCountriesNames.push(originCountryName);
      });
    });

    let getTranslatedCountries: any = void 0;
    let getTranslatedRegions: any = void 0;

    if (countries[0] !== 'World') {
      getTranslatedCountries = this.findCountryTranslatedName(resultCountriesNames);
    }

    if (regions[0] !== 'World') {
      getTranslatedRegions = this.findRegionTranslatedName(regions);
    }

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = this.theWorldTranslate;

      this.selectedCountries.length = 0;
      this.selectedRegions.length = 0;

      return;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = `${getTranslatedCountries.slice(0, this.sliceCount).join(', ')} (+${getTranslatedCountries.length - this.sliceCount})`;
      } else {
        if (this.sliceCount === 1 && countries.length > 1) {
          this.activeCountries = `${getTranslatedCountries.slice(0, this.sliceCount).join(', ')} (+${getTranslatedCountries.length - this.sliceCount})`;
        } else {
          this.activeCountries = getTranslatedCountries.join(' & ');
        }
      }

      this.selectedRegions.length = 0;
      this.selectedCountries = resultCountriesNames;

      this.cloneSelectedLocations(regions, resultCountriesNames);

      return;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.activeCountries = `${getTranslatedCountries.slice(0, this.sliceCount).join(', ')} (+${getTranslatedCountries.length - this.sliceCount})`;
      } else {
        let countriesDiff: string[] = [];
        let regionCountries: string[] = [];

        forEach(this.locations, (location: any) => {
          let currentRegionName: any = location.originRegionName;

          let locationCountriesLength: number = filter(location.countries, (country: any) => {
            return country.empty !== true ? true : false;
          }).length;

          if (regions.indexOf(currentRegionName) !== -1) {
            if (locationCountriesLength === resultRegionsCountries[currentRegionName].length) {
              regionCountries.push(...resultRegionsCountries[currentRegionName]);
            } else {
              resultRegionsCountries = omit(resultRegionsCountries, currentRegionName);
            }
          }
        });

        if (resultCountriesNames.length !== regionCountries.length) {
          countriesDiff = difference(resultCountriesNames, regionCountries);
        }

        if (countriesDiff.length) {
          let countriesCountDiff: number = countries.length - resultCountriesNames.length;
          let activeCountriesNum: number = countries.length - countriesCountDiff - 2;

          this.activeCountries = countriesDiff.length === 1 && regions.length === 1 ?
                                getTranslatedRegions[0] + ' & ' + countriesDiff[0] :
                                `${getTranslatedCountries.slice(0, this.sliceCount).join(', ')} (+${activeCountriesNum - this.sliceCount})`;
        } else {
          if (regions.length > 2) {
            let activeCountriesNum: number = 0;

            forEach(regions, (currentRegion: any) => {
              activeCountriesNum += resultRegionsCountries[currentRegion].length;
            });

            this.activeCountries = `${resultRegionsCountries[getTranslatedRegions[0]].slice(0, 2).join(' & ')} (+${activeCountriesNum - 2})`;
          } else {
            this.activeCountries = getTranslatedRegions.join(' & ');
          }
        }
      }

      this.selectedRegions = Object.keys(resultRegionsCountries);
      this.selectedCountries = resultCountriesNames;

      this.cloneSelectedLocations(regions, resultCountriesNames);

      return;
    }

    let concatLocations: string[] = regions.concat(getTranslatedCountries);

    if (concatLocations.length > 2) {
      this.activeCountries = `${concatLocations.slice(0, this.sliceCount).join(', ')} (+${concatLocations.length - this.sliceCount})`;
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;

    this.cloneSelectedLocations(regions, countries);
  }

  public cloneSelectedLocations(regions: any[], countries: any[]): void {
    this.cloneSelectedRegions = clone(regions);
    this.cloneSelectedCountries = clone(countries);
  }

  public setPosition(): void {
    this.utilsService.getCoordinates('countries-filter', (data: any) => {
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

      if (okayButton && cancelButton && pointerContainer && shortenWidth) {
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
