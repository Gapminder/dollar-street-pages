import { Component, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Rx';

let tpl = require('./social-share-buttons.html');
let style = require('./social-share-buttons.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})

export class SocialShareButtonsComponent implements OnDestroy {
  private socialShareButtonsService: any;
  private location: Location;
  private url: string;
  private socialShareButtonsServiceSubscribe: Subscription;
  private locationPath: string;

  public constructor(@Inject('SocialShareButtonsService') socialShareButtonsService: any,
                     @Inject(Location) location: Location) {
    this.socialShareButtonsService = socialShareButtonsService;
    this.location = location;
  }

  public ngOnDestroy(): void {
    if (this.socialShareButtonsServiceSubscribe && this.socialShareButtonsServiceSubscribe.unsubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }
  }

  protected openPopUp(originalUrl: string): void {
    if (this.socialShareButtonsServiceSubscribe && this.socialShareButtonsServiceSubscribe.unsubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }

    if (this.locationPath === this.location.path()) {
      let left = (window.innerWidth - 490) / 2;
      let popupWin = window.open(originalUrl + this.url, 'contacts', 'location, width=490, height=368, top=100, left=' + left);
      popupWin.focus();

      return;
    }

    this.locationPath = this.location.path();

    this.socialShareButtonsServiceSubscribe = this.socialShareButtonsService.getUrl({url: this.locationPath})
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.url = res.url;
        let left = (window.innerWidth - 490) / 2;
        let popupWin = window.open(originalUrl + this.url, 'contacts', 'location, width=490, height=368, top=100, left=' + left);
        popupWin.focus();
      });
  }
}
