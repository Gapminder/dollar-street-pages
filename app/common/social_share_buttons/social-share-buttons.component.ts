import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

let tpl = require('./social-share-buttons.html');
let style = require('./social-share-buttons.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})

export class SocialShareButtonsComponent implements OnInit, OnDestroy {
  public socialShareButtonsService:any;
  private location:Location;
  private urlChangeService:any;
  private url:string;
  private urlEvents:any;
  private socialShareButtonsServiceSubscribe:any;

  public constructor(@Inject('SocialShareButtonsService') socialShareButtonsService:any,
                     @Inject('UrlChangeService') urlChangeService:any,
                     @Inject(Location) location:Location) {
    this.socialShareButtonsService = socialShareButtonsService;
    this.urlChangeService = urlChangeService;
    this.location = location;
  }

  public ngOnInit():void {
    this.getUrl();

    this.urlEvents = this.urlChangeService
      .getUrlEvents()
      .debounceTime(1000)
      .subscribe(() => {
        this.getUrl();
      });
  }

  public ngOnDestroy():void {
    this.urlEvents.unsubscribe();
    this.socialShareButtonsServiceSubscribe.unsubscribe();
  }

  public getUrl():void {
    let query = {url: this.location.path()};
    this.socialShareButtonsServiceSubscribe = this.socialShareButtonsService.getUrl(query)
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.url = res.url;
      });
  }

  public openPopUp(originalUrl:string):void {
    let left = (window.innerWidth - 490) / 2;
    let popupWin = window.open(originalUrl + this.url, 'contacts', 'location, width=490, height=368, top=100, left=' + left);
    popupWin.focus();
  }
}
