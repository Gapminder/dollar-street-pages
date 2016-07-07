import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';

import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {SocialShareButtonsComponent} from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtonsComponent, DROPDOWN_DIRECTIVES, RouterLink]
})

export class MainMenuComponent implements OnInit, OnDestroy {
  protected isOpenMenu:boolean = false;
  @Input()
  private hoverPlace:Observable<any>;

  private hoverPlaceSubscribe:any;

  public ngOnInit():void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });
  }

  public ngOnDestroy():void {
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }
  }
}
