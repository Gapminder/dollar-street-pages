import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Location} from '@angular/common';

let tpl = require('./social-share-buttons.html');
let style = require('./social-share-buttons.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style]
})

export class SocialShareButtons implements OnInit, OnDestroy {
  public socialShareButtonsService:any;
  private location:Location;
  private urlChangeService:any;
  public url:string;
  public urlEvents:any;
  public socialShareButtonsServiceSubscribe:any;

  constructor(@Inject('SocialShareButtonsService') socialShareButtonsService,
              @Inject('UrlChangeService') urlChangeService,
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
    this.socialShareButtonsServiceSubscribe.unsubscribe();
  }

  getUrl() {
    let query = `url=${this.location.path()}`;

    this.socialShareButtonsServiceSubscribe = this.socialShareButtonsService.getUrl(query)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.url = res.url;
      });
  }

  openPopUp(originalUrl:string) {
    let left = (window.innerWidth - 490) / 2;

    let popupWin = window.open(originalUrl + this.url, 'contacts', 'location, width=490, height=368, top=100, left=' + left);
    popupWin.focus();
  }
}
