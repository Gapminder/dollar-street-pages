import {Component, OnInit, Input, Output, Inject, EventEmitter, Output, OnChanges} from 'angular2/core';
import {Router} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {SearchService} from './search.service';
import {SearchFilter} from './thingFilter.pipe';

let tpl = '';
let desktopStyle = require('./search.component.css');
let mobileStyle = require('./search-mobile.component.css');

let device = require('device.js')();
const isDesktop = device.desktop();

if (isDesktop) {
  tpl = require('./search.component.html');
} else {
  tpl = require('./search-mobile.component.html');
}

@Component({
  selector: 'search',
  template: tpl,
  styles: [desktopStyle, mobileStyle],
  pipes: [SearchFilter]
})

export class SearchComponent implements OnInit, OnChanges {
  @Input()
  private url:string;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input()
  private defaultThing:any;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter();
  @Output()
  private selectedThing:EventEmitter<any> = new EventEmitter();

  private paramsUrl:any;
  private router:Router;
  private states:any = [];
  private isOpen:boolean = false;
  private search:any = {text: ''};
  private regions:any = [];
  private countries:any = [];
  private categories:any = [];
  private activeThing:any = {};
  private activeRegions:any = [];
  private activeCountries:any = [];
  private searchService:SearchService;
  private modalPosition:string;
  private matrixComponent:boolean;
  private mapComponent:boolean;
  private placeComponent:boolean;
  private isDesktop:boolean = isDesktop;
  private mobileTitle:string;
  private tab:number = 0;

  constructor(@Inject(SearchService) searchService, @Inject(Router) _router) {
    this.searchService = searchService;
    this.router = _router;
    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
    this.mapComponent = this.router.hostComponent.name === 'MapComponent';
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
  }

  ngOnInit() {
    this.chosenPlaces && this.chosenPlaces.subscribe((place) => {
      this.paramsUrl = {
        thing: this.activeThing._id,
        place: place[0]._id,
        image: place[0].image
      };

      this.getInitDataForSlider();
    });
  }

  ngOnChanges(properties):void {
    if (properties.url && properties.url.currentValue) {
      this.paramsUrl = this.parseUrl(this.url);
      this.getInitData(true);
    }
  }

  goToThing(thing:any):void {
    if (thing && thing.empty) {
      return;
    }

    if (!thing) {
      thing = this.defaultThing._id;
    }

    this.paramsUrl.thing = thing;

    this.getInitData();
  }

  openSearch(isOpen:boolean):void {
    this.isOpen = !isOpen;
    this.search.text = '';
    let elem = document.getElementById('dropdown-conteiner');
    let cssWidth = window.getComputedStyle(elem).width;
    let elemWidth = parseFloat(cssWidth);
    let parentOffsetLeft = elem.parentElement.offsetLeft;
    let isBigger = parentOffsetLeft + elemWidth < window.innerWidth;

    this.modalPosition = isBigger ? '0px' : window.innerWidth - parentOffsetLeft - elemWidth - 20 + 'px';
  }

  goToRegions(region):void {
    let indexWorld = this.activeRegions.indexOf('World');
    let index = this.activeRegions.indexOf(region);

    if (indexWorld !== -1) {
      this.activeRegions.splice(indexWorld, 1);
    }

    if (index !== -1) {
      this.activeRegions.splice(index, 1);
    } else {
      this.activeRegions.push(region);
    }

    if (region === 'World' &&
      (this.activeRegions[0] === 'World' || !this.activeRegions.length) &&
      (this.activeCountries[0] === 'World' || !this.activeCountries.length)
    ) {
      this.activeRegions = ['World'];
      return;
    }

    if (region === 'World' || !this.activeRegions.length) {
      this.activeRegions = ['World'];
      this.activeCountries = ['World'];
    }

    this.paramsUrl.regions = this.activeRegions;
    this.getInitData();
  }

  goToCountries(location):void {
    if (location.empty) {
      return;
    }

    let index = this.activeCountries.indexOf(location.country);
    let indexWorld = this.activeCountries.indexOf('World');

    if (index === -1) {
      this.activeCountries.push(location.country);
    } else {
      this.activeCountries.splice(index, 1);
    }

    if (indexWorld !== -1 && this.activeCountries.length > 1) {
      this.activeCountries.splice(indexWorld, 1);
    }

    if (!this.activeCountries.length) {
      this.activeCountries = ['World'];
    }

    this.paramsUrl.countries = this.activeCountries;

    this.getInitData();
  }

  removeItemFromState(state:string):void {
    let indexCountry = this.activeCountries.indexOf(state);
    let indexRegion = this.activeRegions.indexOf(state);

    if (indexCountry !== -1) {
      this.activeCountries.splice(indexCountry, 1);

      if (!this.activeCountries.length) {
        this.activeCountries = ['World'];
      }
    }

    if (indexRegion !== -1) {
      this.activeRegions.splice(indexCountry, 1);

      if (!this.activeRegions.length) {
        this.activeRegions = ['World'];
      }
    }

    this.paramsUrl.regions = this.activeRegions;
    this.paramsUrl.countries = this.activeCountries;

    this.getInitData();
  }

  getInitData(init?:boolean) {
    this.isOpen = false;
    this.search.text = '';
    let url:string;

    if (this.matrixComponent) {
      url = `thing=${this.paramsUrl.thing}&countries=${this.paramsUrl.countries.join()}&regions=${this.paramsUrl.regions.join()}&zoom=${this.paramsUrl.zoom}&row=${this.paramsUrl.row}`;
    }

    if (this.mapComponent) {
      url = `thing=${this.paramsUrl.thing}&countries=World&regions=World`;
    }

    if (this.placeComponent) {
      url = `thing=${this.paramsUrl.thing}&image=${this.paramsUrl.image}`;
    }
    this.searchService.getSearchInitData(url)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.countries = res.data.countries;
        this.categories = res.data.categories;
        this.regions = res.data.regions;
        this.activeThing = res.data.thing;

        this.activeRegions = this.paramsUrl.regions;
        this.activeCountries = this.paramsUrl.countries;
        this.selectedThing.emit(this.activeThing);

        if (this.matrixComponent) {
          this.states = this.getLocations(this.activeRegions, this.activeCountries);
        }

        if (this.matrixComponent) {
          this.selectedFilter.emit(url);
        } else {
          this.selectedFilter.emit(this.activeThing);
        }

        if (this.matrixComponent && !this.isDesktop) {
          this.mobileTitle = this.getMobileTitle(this.activeThing, this.states);
        }
      });
  }

  getInitDataForSlider() {
    this.isOpen = false;
    this.search.text = '';
    let url = `thing=${this.paramsUrl.thing}&image=${this.paramsUrl.image}`;

    this.searchService.getSearchInitData(url)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.categories = res.data.categories;
      });
  }

  getMobileTitle(thing, states) {
    let thingName = thing.plural || thing.name;
    let isSelectedWorld = states.indexOf('World') !== -1;

    if (!isSelectedWorld && states && states.length) {
      let countryTitle = states.length > 1 ? 'countries' : 'country';

      return `${thingName} (${states.length} ${countryTitle})`;
    }

    return `${thingName} by income`;
  }

  parseUrl(url:string):any {
    url = '{\"' + url.replace(/&/g, '\",\"') + '\"}';
    url = url.replace(/=/g, '\":\"');

    let query = JSON.parse(url);

    if (this.matrixComponent) {
      query.regions = query.regions.split(',');
      query.countries = query.countries.split(',');
    }

    return query;
  }

  getLocations(regions:any, countries:any):any {
    let states = this.getUnique(regions.concat(countries));
    let indexWorld = states.indexOf('World');

    if (states.length > 1 && indexWorld !== -1) {
      states.splice(indexWorld, 1);
    }

    return states;
  }

  getUnique(items:any):any {
    let u = {}, a = [];

    for (let i = 0, l = items.length; i < l; ++i) {
      if (u.hasOwnProperty(items[i])) {
        continue;
      }

      a.push(items[i]);
      u[items[i]] = 1;
    }

    return a;
  }
}
