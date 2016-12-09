import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService } from '../../common';
import { LanguageService } from '../../shared';
import { PhotographerProfileService } from './photographer-profile.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'photographer-profile',
  templateUrl: './photographer-profile.component.html',
  styleUrls: ['./photographer-profile.component.css']
})

export class PhotographerProfileComponent implements OnInit, OnDestroy {
  public translate: TranslateService;
  public photographerTranslate: string;
  public showDetailsTranslate: string;
  public hideDetailsTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetPhotographerSubscribe: Subscription;
  public translateGetShowDetailsSubscribe: Subscription;
  public translateGetHideDetailsSubscribe: Subscription;

  protected isShowInfo: boolean = false;

  @Input()
  private photographerId: string;
  @Output()
  private getPhotographer: EventEmitter<any> = new EventEmitter<any>();

  private math: MathService;
  private photographer: {firstName?: string, lastName?: string} = {};
  private photographerProfileServiceSubscribe: Subscription;
  private photographerProfileService: PhotographerProfileService;
  private languageService: LanguageService;

  public constructor(math: MathService,
                     photographerProfileService: PhotographerProfileService,
                     translate: TranslateService,
                     languageService: LanguageService) {
    this.translate = translate;
    this.photographerProfileService = photographerProfileService;
    this.math = math;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    let query = `id=${this.photographerId}${this.languageService.getLanguageParam()}`;

    this.translateGetPhotographerSubscribe = this.translate.get('PHOTOGRAPHER').subscribe((res: any) => {
      this.photographerTranslate = res;
    });

    this.translateGetShowDetailsSubscribe = this.translate.get('SHOW_DETAILS').subscribe((res: any) => {
      this.showDetailsTranslate = res;
    });

    this.translateGetHideDetailsSubscribe = this.translate.get('HIDE_DETAILS').subscribe((res: any) => {
      this.hideDetailsTranslate = res;
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const photographerTranslation = event.translations;
      this.photographerTranslate = photographerTranslation.PHOTOGRAPHER;
      this.showDetailsTranslate = photographerTranslation.SHOW_DETAILS;
      this.hideDetailsTranslate = photographerTranslation.HIDE_DETAILS;

      if (this.getPhotographer) {
        this.getPhotographer
          .emit(`<span class="sub-title">${this.photographerTranslate}:</span> ${this.photographer.firstName} ${this.photographer.lastName}`);
      }
    });

    this.photographerProfileServiceSubscribe = this.photographerProfileService.getPhotographerProfile(query)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographer = res.data;
        this.getPhotographer
          .emit(`<span class="sub-title">${this.photographerTranslate}:</span> ${this.photographer.firstName} ${this.photographer.lastName}`);
      });
  }

  public ngOnDestroy(): void {
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (this.translateGetPhotographerSubscribe.unsubscribe) {
      this.translateGetPhotographerSubscribe.unsubscribe();
    }

    if (this.translateGetShowDetailsSubscribe.unsubscribe) {
      this.translateGetShowDetailsSubscribe.unsubscribe();
    }

    if (    this.translateGetHideDetailsSubscribe.unsubscribe) {
      this.translateGetHideDetailsSubscribe.unsubscribe();
    }

    this.photographerProfileServiceSubscribe.unsubscribe();
  }

  protected isShowInfoMore(photographer: any): boolean {
    return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
  }
}
