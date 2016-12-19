import { Component, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
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
  public translate: TranslateService;
  public socialShareButtonsServiceSubscribe: Subscription;
  public socialShareButtonsService: SocialShareButtonsService;
  public shareMessageTranslated: string;
  public translateSubscribe: Subscription;

  public constructor(socialShareButtonsService: SocialShareButtonsService,
                     translate: TranslateService) {
    this.socialShareButtonsService = socialShareButtonsService;
    this.translate = translate;
  }

  public ngOnDestroy(): void {
    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }

    if (this.translateSubscribe) {
      this.translateSubscribe.unsubscribe();
    }
  }

  public openPopUp(target: string): void {
    const twitterUrl: string = 'https://twitter.com/intent/tweet';
    const facebookUrl: string = 'http://www.facebook.com/sharer.php';
    const linkedinUrl: string = 'http://www.linkedin.com/shareArticle';
    const googleUrl: string = 'https://plus.google.com/share';

    let originalUrl: string = '';

    switch(target) {
      case 'twitter':
        originalUrl = twitterUrl;
      break;

      case 'facebook':
        originalUrl = facebookUrl;
      break;

      case 'linkedin':
        originalUrl = linkedinUrl;
      break;

      case 'google':
        originalUrl = googleUrl;
      break;

      default:
        originalUrl = '';
      break;
    }

    if(!this.translateSubscribe) {
      this.translateSubscribe = this.translate.get(['SEE_HOW_PEOPLE', 'REALLY', 'LIVE']).subscribe((res: any) => {
        this.shareMessageTranslated = res.SEE_HOW_PEOPLE+' '+res.REALLY+' '+res.LIVE+' - Dollar Street';
      });
    }

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

        let params: URLSearchParams = new URLSearchParams();
        params.set('url', res.url);
        params.set('text', this.shareMessageTranslated);

        if(target === 'linkedin') {
          params.set('mini', 'true');
        }

        this.url = params.toString();

        this.openWindow(originalUrl, this.url);
      });
  }

  public openWindow(originalUrl: string, url: any): void {
    this.newWindow.location.href = originalUrl + '?' + url;
    this.newWindow.focus();
  }
}
