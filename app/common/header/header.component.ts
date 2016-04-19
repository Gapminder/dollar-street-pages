import {Component, Input, Output, Inject, OnInit, OnDestroy, EventEmitter} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {MainMenuComponent} from '../menu/menu.component';
import {SearchComponent} from '../search/search.component';
import {PlaceMapComponent} from '../place-map/place-map.component';

let device = require('device.js')();

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [SearchComponent, MainMenuComponent, PlaceMapComponent, RouterLink]
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input()
  private query:string;
  @Input()
  private thing:string;
  @Input('hoverPlace')
  private hoverPlace:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Output()
  private filter:EventEmitter<any> = new EventEmitter();

  private activeThing:any;
  private defaultThing:any;
  private headerService:any;
  private router:Router;

  private matrixComponent:boolean;
  private placeComponent:boolean;
  private mapComponent:boolean;
  private isDesktop:boolean = device.desktop();
  private headerServiceSubscribe:any;

  constructor(@Inject('HeaderService') headerService,
              @Inject(Router) router) {
    this.headerService = headerService;
    this.router = router;

    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
    this.mapComponent = this.router.hostComponent.name === 'MapComponent';
  }

  ngOnInit():void {
    this.headerServiceSubscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.defaultThing = res.data;
      });
  }

  ngOnDestroy():void {
    this.headerServiceSubscribe.unsubscribe();
  }

  urlTransfer(url) {
    this.filter.emit(url);
  }

  activeThingTransfer(thing) {
    this.activeThing = thing;
  }

  goToMain() {
    this.router.navigate(['Main']);
  }
}
