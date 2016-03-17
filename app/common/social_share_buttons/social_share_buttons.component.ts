import {Component, OnInit, OnDestroy, Inject} from 'angular2/core';
import {Location} from 'angular2/router';

import {UrlChangeService} from '../url-change/url-change.service';
import {SocialShareButtonsService} from './social_share_buttons.service';

let tpl = require('./social_share_buttons.component.html');
let style = require('./social_share_buttons.component.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style],
  providers: [SocialShareButtonsService]
})

export class SocialShareButtons implements OnInit, OnDestroy {
  public socialShareButtonsService:SocialShareButtonsService;
  private location:Location;
  private urlChangeService:UrlChangeService;
  public url:string;
  public urlEvents:any;

  constructor(@Inject(SocialShareButtonsService) socialShareButtonsService,
              @Inject(UrlChangeService) urlChangeService,
              @Inject(Location) location) {
    this.socialShareButtonsService = socialShareButtonsService;
    this.urlChangeService = urlChangeService;
    this.location = location;
  }

  ngOnInit():void {
    this.getUrl();

    this.urlEvents = this.urlChangeService
      .getUrlEvents()
      .debounceTime(300)
      .subscribe(() => {
        this.getUrl();
      });
  }

  ngOnDestroy() {
    this.urlEvents.unsubscribe();
  }

  getUrl() {
    let query = `url=${this.location.path()}`;

    this.socialShareButtonsService.getUrl(query)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.url = res.url;
      });
  }

  openPopUp(originalUrl:string) {
    let left = (window.innerWidth - 490) / 2;

    let popupWin = window.open(originalUrl + this.url, "contacts", '"location, width=490, height=368, top=100, left=' + left);
    popupWin.focus();
  }
}
