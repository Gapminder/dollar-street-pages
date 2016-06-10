import {Component, OnDestroy, OnChanges, Inject, Input, Output, EventEmitter} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';

import {ThingsFilterPipe} from './things-filter.pipe';

let tpl = require('./things-filter.template.html');
let style = require('./things-filter.css');

@Component({
  selector: 'things-filter',
  template: tpl,
  styles: [style],
  directives: [RouterLink],
  pipes: [ThingsFilterPipe]
})

export class ThingsFilterComponent implements OnDestroy, OnChanges {
  protected relatedThings:any[];
  protected otherThings:any[];
  protected activeThing:any = {};
  protected search:{text:string;} = {text: ''};
  protected isOpenThingsFilter:boolean = false;
  @Input()
  private url:string;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter();
  private thingsFilterService:any;
  private thingsFilterServiceSubscribe:any;
  private mapComponent:boolean;
  private router:Router;

  public constructor(@Inject('ThingsFilterService') thingsFilterService:any,
                     @Inject(Router) router:Router) {
    this.thingsFilterService = thingsFilterService;
    this.router = router;
    this.mapComponent = this.router.hostComponent.name === 'MapComponent';
  }

  protected openThingsFilter(isOpenThingsFilter:boolean):void {
    this.isOpenThingsFilter = !isOpenThingsFilter;
  }

  protected goToThing(thing:any):void {
    if (thing.empty) {
      return;
    }

    let query = this.parseUrl(this.url);
    query.thing = thing._id;

    this.selectedFilter.emit({url: this.objToQuery(query), thing: this.activeThing});
    this.isOpenThingsFilter = false;
    this.search = {text: ''};
  }

  public ngOnDestroy():void {
    this.thingsFilterServiceSubscribe.unsubscribe();
  }

  public ngOnChanges(changes:any):void {
    if (changes.url.currentValue) {
      if (this.thingsFilterServiceSubscribe) {
        this.thingsFilterServiceSubscribe.unsubscribe();
        this.thingsFilterServiceSubscribe = void 0;
      }

      this.thingsFilterServiceSubscribe = this
        .thingsFilterService
        .getThings(this.url)
        .subscribe((res:any) => {
          if (res.err) {
            return res.err;
          }

          this.relatedThings = res.data.relatedThings;
          this.otherThings = res.data.otherThings;
          this.activeThing = res.data.thing;
        });
    }
  }

  private objToQuery(data:any):string {
    return Object.keys(data).map((k:string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url:string):any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    if (query.regions) {
      query.regions = query.regions.split(',');
    }

    if (query.countries) {
      query.countries = query.countries.split(',');
    }

    return query;
  }
}
