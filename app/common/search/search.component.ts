import {Component, OnInit, Input, Inject, EventEmitter} from 'angular2/core';
import {SearchService} from './search.service';
import {SearchFilter} from './thingFilter.pipe';

let tpl = require('./search.component.html');
let style = require('./search.component.css');

@Component({
  selector: 'search',
  template: tpl,
  styles: [style],
  pipes: [SearchFilter],
  outputs: ['selectedFilter', 'selectedThing']
})

export class SearchComponent implements OnInit {
  @Input()
  private query:string;

  private title:any = [];
  private isOpen:boolean = false;
  private search:any = {text: ''};
  private regions:any = [];
  private countries:any = [];
  private categories:any = [];
  private activeThing:any = {};
  private activeRegions:any = [];
  private activeCountries:any = [];
  private searchService:SearchService;
  private defaultThing:string = '5477537786deda0b00d43be5';
  private selectedFilter:EventEmitter<any> = new EventEmitter();
  public selectedThing:EventEmitter<any> = new EventEmitter();
  private modalPosition:string;

  constructor(@Inject(SearchService) searchService) {
    this.searchService = searchService;
  }

  ngOnInit() {
    this.getInitData(this.query, true);
  }

  goToThing(thing) {
    if (thing && thing.empty) {
      return;
    }

    let url:string;

    if (!thing) {
      thing = this.defaultThing;
    }

    url = `thing=${thing}&countries=${this.activeCountries.join()}&regions=${this.activeRegions.join()}`;

    this.getInitData(url);
  }

  openSearch(isOpen) {
    this.isOpen = !isOpen;
    let elem = document.getElementById('dropdown-conteiner');
    let cssWidth = window.getComputedStyle(elem).width;
    let elemWidth = parseFloat(cssWidth);
    let parentOffsetLeft = elem.parentElement.offsetLeft;
    let isBigger = parentOffsetLeft + elemWidth < window.innerWidth;

    this.modalPosition = isBigger ? '0px' : window.innerWidth - parentOffsetLeft - elemWidth - 20 + 'px';
  }

  goToRegions(region) {
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

    let url:string = `thing=${this.activeThing._id}&countries=${this.activeCountries.join()}&regions=${this.activeRegions.join()}`;

    this.getInitData(url);
  }

  goToCountries(location) {
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

    let url:string = `thing=${this.activeThing._id}&countries=${this.activeCountries.join()}&regions=${this.activeRegions.join()}`;

    this.getInitData(url);
  }

  removeItemFromState(state:string) {
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

    let url:string = `thing=${this.activeThing._id}&countries=${this.activeCountries.join()}&regions=${this.activeRegions.join()}`;

    this.getInitData(url);
  }

  getInitData(url, init?) {
    this.isOpen = false;
    this.search.text = '';

    if (!init) {
      this.selectedFilter.emit(url);
    }

    let query = this.parseUrl(url);

    this.searchService.getSearchInitData(url)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.countries = res.data.countries;
        this.categories = res.data.categories;
        this.regions = res.data.regions;
        this.activeThing = res.data.thing;

        this.activeRegions = query.regions;
        this.activeCountries = query.countries;
        this.selectedThing.next(this.activeThing);

        this.title = this.getTitle(this.activeRegions, this.activeCountries);
      });
  }

  parseUrl(url:string):any {
    url = '{\"' + url.replace(/&/g, '\",\"') + '\"}';
    url = url.replace(/=/g, '\":\"');

    let query = JSON.parse(url);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }

  getTitle(regions, countries):any {
    let states = this.getUnique(regions.concat(countries));
    let indexWorld = states.indexOf('World');

    if (states.length > 1 && indexWorld !== -1) {
      states.splice(indexWorld, 1);
    }

    return states;
  }

  makeStateName(state, $index) {
    console.log(arguments);
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
