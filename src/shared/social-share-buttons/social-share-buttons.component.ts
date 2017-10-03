import { Component, OnDestroy, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService, SocialShareService } from '../../common';
import { SocialShareButtonsService } from './social-share-buttons.service';

@Component({
  selector: 'social-share-buttons',
  templateUrl: './social-share-buttons.component.html',
  styleUrls: ['./social-share-buttons.component.css']
})
export class SocialShareButtonsComponent implements OnInit, OnDestroy {
  public url: string;
  public locationPath: string;
  public newWindow: any;
  public location: any = location;
  public window: Window = window;
  public getTranslationSubscribe: Subscription;
  public socialShareButtonsServiceSubscribe: Subscription;
  public shareMessageTranslated: string;

  public constructor(private socialShareButtonsService: SocialShareButtonsService,
                     private languageService: LanguageService,
                     private socialShareService: SocialShareService) {
  }

  public ngOnInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation(['SEE_HOW_PEOPLE', 'REALLY', 'LIVE']).subscribe((trans: any) => {
        this.shareMessageTranslated = trans.SEE_HOW_PEOPLE+' '+trans.REALLY+' '+trans.LIVE;
    });
  }

  public ngOnDestroy(): void {
    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }

    this.getTranslationSubscribe.unsubscribe();
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

    let left: number = (this.window.innerWidth - 490) / 2;
    this.newWindow = this.window.open('', '_blank', 'width=490, height=368, top=100, left=' + left);

    this.locationPath = this.location.pathname + this.location.search;

    if (this.socialShareButtonsServiceSubscribe) {
      this.socialShareButtonsServiceSubscribe.unsubscribe();
    }

    this.socialShareButtonsServiceSubscribe = this.socialShareButtonsService.getUrl({url: this.locationPath})
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let params: URLSearchParams = new URLSearchParams();

        switch(target) {
          case 'twitter':
            params.set('url', res.url);
            params.set('text', this.shareMessageTranslated + '- Dollar Street');
          break;

          case 'facebook':
            params.set('u', res.url);
            params.set('description', this.shareMessageTranslated);
          break;

          case 'linkedin':
            params.set('mini', 'true');
            params.set('url', res.url);
            params.set('summary', this.shareMessageTranslated);
          break;

          case 'google':
            params.set('url', res.url);
            params.set('text', this.shareMessageTranslated);
          break;

          default:
          break;
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
