import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LanguageService, CountryDetectorService, BrowserDetectionService } from '../../common';

@Component({
  selector: 'translate-me',
  templateUrl: './translate-me.component.html',
  styleUrls: ['./translate-me.component.css']
})
export class TranslateMeComponent implements OnInit, OnDestroy {
  public url: string = 'https://crowdin.com/project/dollar-street/';
  public mode: string;
  public languageService: LanguageService;
  public countryDetectorService: CountryDetectorService;
  public device: BrowserDetectionService;

  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;

  public getCountryNameSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;

  public element: HTMLElement;
  public countryName: string;
  public translateMeContainer: HTMLElement;
  public infoText: string;

  public constructor(elementRef: ElementRef,
                     languageService: LanguageService,
                     countryDetectorService: CountryDetectorService,
                     browserDetectionService: BrowserDetectionService) {
    this.languageService = languageService;
    this.countryDetectorService = countryDetectorService;
    this.device = browserDetectionService;

    this.isDesktop = this.device.isDesktop();
    this.isMobile = this.device.isMobile();
    this.isTablet = this.device.isTablet();

    this.element = elementRef.nativeElement as HTMLElement;
  }

  public ngOnInit(): void {
    this.url = this.url + this.languageService.currentLanguage;

    this.translateMeContainer = this.element.querySelector('.translate-me-container') as HTMLElement;

    this.getCountryNameSubscribe = this.countryDetectorService.getCountry().subscribe((res: any) => {
      this.countryName = res.data.country;

      this.getTranslationSubscribe = this.languageService.getTranslation(['NOT_TRANSLATED', 'MAKE_USEFUL']).subscribe((trans: any) => {
        this.infoText = `${trans.NOT_TRANSLATED} ${this.languageService.languageName}. ${trans.MAKE_USEFUL} ${this.countryName}.`;
      });
    });

    const viewMode: string = this.isDesktop ? 'desktop' : (this.isMobile || this.isTablet ? 'mobile' : 'desktop');

    this.setViewMode(viewMode);
  }

  public ngOnDestroy(): void {
    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.getCountryNameSubscribe) {
      this.getCountryNameSubscribe.unsubscribe();
    }
  }

  public setViewMode(mode: string): void {
    if (mode) {
      this.mode = mode;
    }

    switch(this.mode) {
      case 'mobile':
        this.translateMeContainer.classList.remove('translate-me-desktop');
        this.translateMeContainer.classList.add('translate-me-mobile');
      break;

      case 'desktop':
        this.translateMeContainer.classList.remove('translate-me-mobile');
        this.translateMeContainer.classList.add('translate-me-desktop');
      break;

      default:
      break;
    }
  }
}
