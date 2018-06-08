import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LanguageService } from '../../common';
import { PhotographerProfileService } from './photographer-profile.service';

interface Photographer {
  firstName?: string;
  lastName?: string;
  country?: any;
  description: string;
  video?: any;
  company?: any;
  google?: string;
  twitter?: string;
  facebook?: string;
  linkedIn?: string;
  avatar?: string;
  imagesCount?: number;
  placesCount?: number;
}

@Component({
  selector: 'photographer-profile',
  templateUrl: './photographer-profile.component.html',
  styleUrls: ['./photographer-profile.component.css']
})
export class PhotographerProfileComponent implements OnInit, OnDestroy {
  public photographerTranslate: string;
  public showDetailsTranslate: string;
  public hideDetailsTranslate: string;

  public getTranslationSubscribe: Subscription;
  public photographerProfileServiceSubscribe: Subscription;

  public isShowInfo: boolean = false;

  @Input()
  public photographerId: string;
  @Output()
  public getPhotographer: EventEmitter<any> = new EventEmitter<any>();

  public photographer: Photographer;

  public constructor(private math: MathService,
                     private photographerProfileService: PhotographerProfileService,
                     private languageService: LanguageService) {
  }

  public ngOnInit(): void {
    let query = `id=${this.photographerId}${this.languageService.getLanguageParam()}`;

    this.getTranslationSubscribe = this.languageService.getTranslation(['PHOTOGRAPHER', 'SHOW_DETAILS', 'HIDE_DETAILS']).subscribe((trans: any) => {
      this.photographerTranslate = trans.PHOTOGRAPHER;
      this.showDetailsTranslate = trans.SHOW_DETAILS;
      this.hideDetailsTranslate = trans.HIDE_DETAILS;
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
    this.photographerProfileServiceSubscribe.unsubscribe();
    this.getTranslationSubscribe.unsubscribe();
  }

  public isShowInfoMore(photographer: any): boolean {
    if(photographer) {
      return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
    }

    return false;
  }
}
