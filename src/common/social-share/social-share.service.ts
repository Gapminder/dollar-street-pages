import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from '../language/language.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SocialShareService {
    url: string;
    locationPath: string;
    newWindow: any;
    location: any = location;
    window: Window = window;
    document: Document = document;
    elementTagName: string = 'script';
    facebookElementId: string = 'facebook-jssdk';
    twitterElementId: string = 'twitter-wjs';
    documentCreatedSubscribe: Subscription;
    twitterInstance: any;
    sharesTitleTranslated: string;
    shareMessageTranslated: string;
    twitterShareMessageTranslated: string;
    getTranslationSubscribe: Subscription;
    getLanguagesListSubscription: Subscription;

    constructor(private languageService: LanguageService,
                       private http: Http) {
        this.documentCreatedSubscribe = Observable.fromEvent(document, 'DOMContentLoaded')
          .subscribe(() => {
              this.facebookLike();
              this.twitterInstance = this.twitterFollow();
          });

        this.getTranslationSubscribe = this.languageService.getTranslation(['PHOTOS_AS_DATA','LIVES_ON_DOLLAR_STREET', 'LIVES_ON_DOLLAR_STREET_TWITTER']).subscribe((trans: any) => {
            this.sharesTitleTranslated = trans.PHOTOS_AS_DATA;
            this.shareMessageTranslated = trans.LIVES_ON_DOLLAR_STREET;
            this.twitterShareMessageTranslated = trans.LIVES_ON_DOLLAR_STREET_TWITTER;
        });
    }

    private getShortUrl(query: any): Promise<any> {
      return this.http.post(`${environment.consumerApi}/v1/shorturl`, query).map((res: any) => {
        let parseRes = JSON.parse(res._body);
        return {err: parseRes.error, url: parseRes.data};
      }).toPromise();
    }

    facebookLike(): void {
        const languageReplaceSchema: any = {
            ur_IN: 'ur_PK'
        };

        if (this.getLanguagesListSubscription) {
          this.getLanguagesListSubscription.unsubscribe();
        }

        this.getLanguagesListSubscription = this.languageService.getLanguagesList().subscribe((data: any) => {
          let currentLanguage: string = this.languageService.getLanguageIso();

          if(currentLanguage in languageReplaceSchema) {
              currentLanguage = languageReplaceSchema[currentLanguage];
          }

          let fjs: HTMLElement = this.document.getElementsByTagName(this.elementTagName)[0] as HTMLElement;

          if (this.document.getElementById(this.facebookElementId)) {
              return;
          }

          let js: HTMLElement = this.document.createElement(this.elementTagName) as HTMLElement;
          js.setAttribute('id', this.facebookElementId);
          js.setAttribute('src', '//connect.facebook.net/'+currentLanguage+'/sdk.js#xfbml=1&version=v2.8');
          fjs.parentNode.insertBefore(js, fjs);
        });
    }

    twitterFollow(): any {
        let fjs: HTMLElement = this.document.getElementsByTagName(this.elementTagName)[0] as HTMLElement;

        this.twitterInstance = this.twitterInstance || {};

        if (this.document.getElementById(this.twitterElementId)) {
            return this.twitterInstance;
        }

        let js: HTMLElement = this.document.createElement(this.elementTagName) as HTMLElement;
        js.setAttribute('id', this.twitterElementId);
        js.setAttribute('src','https://platform.twitter.com/widgets.js');

        fjs.parentNode.insertBefore(js, fjs);

        this.twitterInstance._e = [];
        this.twitterInstance.ready = (f: any) => {
            this.twitterInstance._e.push(f);
        };

        return this.twitterInstance;
    }

    public openPopUp(target: string, url: string = null): void {
      console.log(url);
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

      if (!url) {
        this.getShortUrl({url: this.locationPath}).then((res: any) => {
            if (res.err) {
              console.error(res.err);
              return;
            }

          let params: URLSearchParams = new URLSearchParams();

            switch(target) {
              case 'twitter':
                params.set('url', res.url);
                params.set('text', this.twitterShareMessageTranslated);
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
      } else {
        const params: URLSearchParams = new URLSearchParams();

        switch(target) {
          case 'twitter':
            params.set('url', url);
            params.set('text', this.twitterShareMessageTranslated);
          break;

          case 'facebook':
            params.set('u', url);
            params.set('title', this.sharesTitleTranslated);
            params.set('description', this.shareMessageTranslated);
          break;

          case 'linkedin':
            params.set('mini', 'true');
            params.set('url', url);
            params.set('summary', this.shareMessageTranslated);
          break;

          case 'google':
            params.set('url', url);
            params.set('text', this.shareMessageTranslated);
          break;

          default:
          break;
        }

        this.url = params.toString();

        this.openWindow(originalUrl, this.url);
      }
    }

    public openWindow(originalUrl: string, url: any): void {
      this.newWindow.location.href = originalUrl + '?' + url;
      this.newWindow.focus();
    }
}
