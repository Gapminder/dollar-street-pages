import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocialShareButtonsService } from './social-share-buttons.service';

@Component({
  selector: 'social-share-buttons',
  templateUrl: 'social-share-buttons.component.html',
  styleUrls: ['social-share-buttons.component.css']
})

export class SocialShareButtonsComponent implements OnDestroy {
  public url: string;
  public locationPath: string;
  public newWindow: any;
  public location: any = location;
  public window: Window = window;
  public socialShareButtonsServiceSubscribe: Subscription;
  public socialShareButtonsService: SocialShareButtonsService;

  public constructor(socialShareButtonsService: SocialShareButtonsService) {
    this.socialShareButtonsService = socialShareButtonsService;
  }

  public ngOnDestroy(): void {
    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }
  }

  public openPopUp(originalUrl: string): void {
    let left: number = (this.window.innerWidth - 490) / 2;
    this.newWindow = this.window.open('', '_blank', 'width=490, height=368, top=100, left=' + left);

    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }

    if (this.locationPath === this.location.pathname + this.location.search) {
      this.openWindow(originalUrl, this.url);

      return;
    }

    this.locationPath = this.location.pathname + this.location.search;

    this.socialShareButtonsServiceSubscribe = this.socialShareButtonsService.getUrl({url: this.locationPath})
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.url = res.url;
        this.openWindow(originalUrl, this.url);
      });
  }

  public openWindow(originalUrl: string, url: any): void {
    this.newWindow.location.href = originalUrl + url;
    this.newWindow.focus();
  }
}
