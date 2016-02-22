import {Component, OnChanges, Input, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {RouterLink} from 'angular2/router';

import {SocialShareButtons} from '../social_share_buttons/social_share_buttons.component';

let tpl = require('./menu.component.html');
let style = require('./menu.component.css');

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
  private matrixComponent:boolean;

  constructor(@Inject(Router) _router) {
    this.router = _router;
    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
  }

  ngOnChanges(changes) {
    if (this.activeThing && this.defaultThing) {
      this.thing = this.activeThing;

      if (this.matrixComponent) {
        console.log(this.defaultThing);
        this.thing = this.defaultThing;
      }

      this.goToMatrix = {thing: this.thing._id, countries: ['World'], regions: ['World'], zoom: 5, row: 1};
    }
  }
}
