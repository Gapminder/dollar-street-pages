import {Component, OnChanges, Input, Inject, OnInit, OnDestroy} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';

import {SocialShareButtons} from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons, RouterLink]
})

export class MainMenuComponent implements OnInit, OnDestroy, OnChanges {
  protected isOpenMenu:boolean = false;
  @Input()
  private activeThing:string;
  @Input()
  private defaultThing:any;
  @Input()
  private hoverPlace:Observable<any>;

  private thing:any = {};
  private goToMatrix:any = {};
  private router:Router;
  private placeComponent:boolean;
  private hoverPlaceSubscribe:any;

  public constructor(@Inject(Router) router:Router) {
    this.router = router;
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
  }

  public ngOnInit():void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });
  }

  public ngOnDestroy():void {
    this.hoverPlaceSubscribe.unsubscribe();
  }

  public ngOnChanges():void {
    if (this.defaultThing) {
      if (this.activeThing && this.placeComponent) {
        this.thing = this.activeThing;
      }

      if (!this.placeComponent) {
        this.thing = this.defaultThing;
      }

      this.goToMatrix = {thing: this.thing._id, countries: ['World'], regions: ['World'], zoom: 5, row: 1};
    }
  }
}
