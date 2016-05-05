import {Component, OnChanges, Input, Inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';

import {SocialShareButtons} from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons, RouterLink]
})

export class MainMenuComponent implements OnChanges {
  @Input()
  private activeThing:string;
  @Input()
  private defaultThing:any;

  private thing:any = {};
  private goToMatrix:any = {};
  private router:Router;
  private placeComponent:boolean;

  constructor(@Inject(Router) _router) {
    this.router = _router;
    this.placeComponent = this.router.hostComponent.name === 'PlaceComponent';
  }

  ngOnChanges(changes) {
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
