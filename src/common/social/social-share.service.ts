import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from '../language/language.service';

@Injectable()
export class SocialShareService {
    public document: Document = document;
    public elementTagName: string = 'script';
    public facebookElementId: string = 'facebook-jssdk';
    public twitterElementId: string = 'twitter-wjs';
    public documentCreatedSubscribe: Subscription;
    public languageService: LanguageService;
    public twitterInstance: any;

    public constructor(@Inject(LanguageService) languageService: LanguageService) {
        this.languageService = languageService;

        this.documentCreatedSubscribe = Observable.fromEvent(document, 'DOMContentLoaded')
          .subscribe(() => {
              this.facebookLike();
              this.twitterInstance = this.twitterFollow();
          });
    }

    public facebookLike(): void {
        const languageReplaceSchema: any = {
            ur_IN: 'ur_PK'
        };

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
    }

    public twitterFollow(): any {
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
}
