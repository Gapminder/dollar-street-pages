import { Component, OnInit, Inject } from 'angular2/core';
import {SocialShareButtonsService} from './social_share_buttons.service';
import {PlatformLocation} from 'angular2/router';

let tpl = require('./social_share_buttons.component.html');
let style = require('./social_share_buttons.component.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style],
  providers: [SocialShareButtonsService]
})

export class SocialShareButtons {
  public socialShareButtonsService: SocialShareButtonsService;
  private platformLocation: PlatformLocation;
  public url:string;

  constructor(@Inject(SocialShareButtonsService) socialShareButtonsService:any,
              @Inject(PlatformLocation) platformLocation:any) {
    this.socialShareButtonsService = socialShareButtonsService;
    this.platformLocation = platformLocation;

  }

  ngOnInit(): void {
    this.getUrl();
  }

  getUrl() {

    let query =`url=${this.platformLocation.location.href}`;

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

    let popupWin = window.open(originalUrl+this.url, "contacts",'"location, width=490, height=368, top=100, left=' + left);
    popupWin.focus();
    console.log(this);
  }
}
