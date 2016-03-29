import {Component, Input, Output, Inject, OnInit,OnDestroy, EventEmitter} from 'angular2/core';
import {RouterLink,Router} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {MainMenuComponent} from '../menu/menu.component';
import {SearchComponent} from '../search/search.component';
import {PlaceMapComponent} from '../place-map/place-map.component';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [SearchComponent, MainMenuComponent, PlaceMapComponent, RouterLink]
})

export class HeaderComponent implements OnInit,OnDestroy {
  @Input()
  private query:string;
  @Input('hoverPlace')
  private hoverPlace:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Output()
  private filter:EventEmitter<any> = new EventEmitter();

  private activeThing:any;
  private defaultThing:any;
  private hoveredPlace:any;
  private headerService:any;
  private router:Router;

  private headerServiceSubscribe:any;
  private hoverPlaceSubscribe:any;

  constructor(@Inject('HeaderService') headerService,
              @Inject(Router) router) {
    this.headerService = headerService;
    this.router = router;
  }

  ngOnInit():void {
    this.headerServiceSubscribe = this.headerService.getDefaultThing()
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.defaultThing = res.data;
      });
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((place)=> {
        this.hoveredPlace = place;
      })
  }

  ngOnDestroy():void {
    this.headerServiceSubscribe.unsubscribe();
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }
  }

  urlTransfer(url) {
    this.filter.emit(url);
  }

  activeThingTransfer(thing) {
    this.activeThing = thing;
  }
  goToMain(){
    this.router.navigate(['Main'])
  }
}
