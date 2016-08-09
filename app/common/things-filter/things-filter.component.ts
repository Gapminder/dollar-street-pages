import {
  Component,
  OnDestroy,
  OnChanges,
  Inject,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs/Rx';
import { ThingsFilterPipe } from './things-filter.pipe';

let tpl = require('./things-filter.template.html');
let style = require('./things-filter.css');

@Component({
  selector: 'things-filter',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ThingsFilterPipe]
})

export class ThingsFilterComponent implements OnDestroy, OnChanges {
  protected relatedThings:any[];
  protected popularThings:any[];
  protected otherThings:any[];
  protected activeThing:any = {};
  protected search:{text:string;} = {text: ''};
  protected isOpenThingsFilter:boolean = false;
  @Input()
  private url:string;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter<any>();
  private thingsFilterService:any;
  private thingsFilterServiceSubscribe:Subscriber;
  private activatedRoute:ActivatedRoute;
  private element:ElementRef;
  private angulartics2GoogleAnalytics:any;

  public constructor(@Inject(ActivatedRoute) activatedRoute:ActivatedRoute,
                     @Inject(ElementRef) element:ElementRef,
                     @Inject('ThingsFilterService') thingsFilterService:any,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics:any) {
    this.thingsFilterService = thingsFilterService;
    this.activatedRoute = activatedRoute;
    this.element = element;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideThingsFilterClick(event:Event):void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenThingsFilter) {
      this.isOpenThingsFilter = false;
      this.search = {text: ''};
    }
  }

  protected openThingsFilter(isOpenThingsFilter:boolean):void {
    this.isOpenThingsFilter = !isOpenThingsFilter;
  }

  protected goToThing(thing:any):void {
    if (thing.empty) {
      return;
    }

    this.angulartics2GoogleAnalytics.eventTrack(`Matrix page with thing - ${thing.thingName}`);
    let query = this.parseUrl(this.url);
    query.thing = thing.plural;

    this.selectedFilter.emit({url: this.objToQuery(query), thing: this.activeThing});
    this.isOpenThingsFilter = false;
    this.search = {text: ''};
  }

  public ngOnDestroy():void {
    this.thingsFilterServiceSubscribe.unsubscribe();
  }

  public ngOnChanges(changes:any):void {
    if (changes.url && changes.url.currentValue) {
      if (this.thingsFilterServiceSubscribe) {
        this.thingsFilterServiceSubscribe.unsubscribe();
      }

      this.thingsFilterServiceSubscribe = this
        .thingsFilterService
        .getThings(this.url)
        .subscribe((res:any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.relatedThings = res.data.relatedThings;
          this.popularThings = res.data.popularThings;
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
