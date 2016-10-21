import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { SocialShareButtonsService } from './social-share-buttons.service';

@Component({
  selector: 'social-share-buttons',
  templateUrl: './social-share-buttons.html',
  styleUrls: ['./social-share-buttons.css'],
  encapsulation: ViewEncapsulation.None
})

export class SocialShareButtonsComponent implements OnDestroy {
  private url: string;
  private locationPath: string;
  private newWindow: any;
  private location: any = location;
  private window: Window = window;
  private socialShareButtonsServiceSubscribe: Subscription;
  private socialShareButtonsService: SocialShareButtonsService;

  public constructor(socialShareButtonsService: SocialShareButtonsService) {
    this.socialShareButtonsService = socialShareButtonsService;
  }

  public ngOnDestroy(): void {
    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }
  }

  protected openPopUp(originalUrl: string): void {
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

  protected openWindow(originalUrl: string, url: any): void {
    this.newWindow.location.href = originalUrl + url;
    this.newWindow.focus();
  }
}
