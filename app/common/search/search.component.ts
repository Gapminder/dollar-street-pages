import {Component, OnInit, Input, Output, Inject, EventEmitter, Output} from 'angular2/core';
import {Router} from 'angular2/router';

import {SearchService} from './search.service';
import {SearchFilter} from './thingFilter.pipe';

let tpl = require('./search.component.html');
let style = require('./search.component.css');

@Component({
  selector: 'search',
  template: tpl,
  styles: [style],
  pipes: [SearchFilter]
})

export class SearchComponent implements OnInit {
  @Input()
  private url:string;
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
  private activeImage:any = {};
  private activeThing:any = {};
  private activeRegions:any = [];
  private activeCountries:any = [];
  private searchService:SearchService;
  private modalPosition:string;
  private matrixComponent:boolean;

  constructor(@Inject(SearchService) searchService, @Inject(Router) _router) {
    this.searchService = searchService;
    this.router = _router;
    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
  }

  ngOnInit():void {
    this.paramsUrl = this.parseUrl(this.url);

    this.getInitData(true);
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

  getInitData(init?) {
    this.isOpen = false;
    this.search.text = '';
    let url:string;

    if (this.matrixComponent) {
      url = `thing=${this.paramsUrl.thing}&countries=${this.paramsUrl.countries.join()}&regions=${this.paramsUrl.regions.join()}&zoom=${this.paramsUrl.zoom}&row=${this.paramsUrl.row}`;
    } else {
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

        this.selectedFilter.emit(this.activeThing);
        
        this.activeRegions = this.paramsUrl.regions;
        this.activeCountries = this.paramsUrl.countries;
        this.activeImage = this.paramsUrl.image;
        this.selectedThing.emit(this.activeThing);

        if (this.matrixComponent) {
          this.states = this.getLocations(this.activeRegions, this.activeCountries);
        }
      });
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
