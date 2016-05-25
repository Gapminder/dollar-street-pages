import {Component, Input, Output, Inject, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import {RouterLink, Router} from '@angular/router-deprecated';
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
  public query:string;
  @Input()
  public thing:string;
  @Input('hoverPlace')
  public hoverPlace:Observable<any>;
  @Input('chosenPlaces')
  public chosenPlaces:Observable<any>;
  public isDesktop:boolean = device.desktop();
  @Output()
  private filter:EventEmitter<any> = new EventEmitter();
  private activeThing:any;
  private defaultThing:any;
  private headerService:any;
  private router:Router;

  private matrixComponent:boolean;
  private placeComponent:boolean;
  private mapComponent:boolean;
  private headerServiceSubscribe:any;

  public constructor(@Inject('HeaderService') headerService:any,
                     @Inject(Router) router:Router) {
    this.headerService = headerService;
    this.router = router;

    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
    this.mapComponent = this.router.hostComponent.name === 'MapComponent';
  }

  public ngOnInit():void {
    this.headerServiceSubscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.defaultThing = res.data;
      });
  }

  public ngOnDestroy():void {
    this.headerServiceSubscribe.unsubscribe();
  }

  public urlTransfer(url) {
    this.filter.emit(url);
  }

  public activeThingTransfer(thing) {
    this.activeThing = thing;
  }

  public goToMain() {
    this.router.navigate(['Main']);
  }
}
