import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../language-selector/language.service';
import { LocalStorageService } from '../../common';
import * as _ from 'lodash';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})

export class LanguageSelectorComponent implements OnInit, OnDestroy {
  public disabled: boolean = false;
  public status: {isOpen: boolean} = {isOpen: false};
  public translate: TranslateService;
  public languageService: LanguageService;
  public getLanguagesListSubscribe: Subscription;
  public languages: any[];
  public element: HTMLElement;
  public currentLanguage: string;
  public window: Window = window;
  public localStorageService: LocalStorageService;
  public defaultLanguage: any;
  public defaultSecondLanguage: any;
  public languageCountToShow: number = 2;

  public constructor(languageService: LanguageService,
                     element: ElementRef,
                     translate: TranslateService,
                     localStorageService: LocalStorageService) {
    this.translate = translate;
    this.element = element.nativeElement;
    this.languageService = languageService;
    this.localStorageService = localStorageService;
  }

  public ngOnInit(): void {
    this.currentLanguage = this.languageService.currentLanguage;
    this.getLanguagesListSubscribe = this.languageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let isLangPublishedOrExists = _.find(res.data, {code: this.currentLanguage});

        if (!isLangPublishedOrExists && this.translate.currentLang) {
          this.localStorageService.setItem('language', this.translate.getDefaultLang());
          this.window.location.href = this.window.location.href.replace(`lang=${this.currentLanguage}`, `lang=${this.translate.getDefaultLang()}`);
        }

        this.languages = _.filter(res.data, (language: any): any => {
          if (!language) {
            return;
          }

          if (language.code === 'en') {
            this.defaultLanguage = language;
          }

          if (language.code === this.currentLanguage) {
            this.defaultSecondLanguage = language;
          }

          if (language.code !== 'en' && language.code !== this.currentLanguage) {
            return language;
          }
        });

        if (this.defaultSecondLanguage && this.defaultSecondLanguage.code === 'en') {
          this.defaultSecondLanguage = this.languages.length ? _.first(this.languages.splice(0, 1)) : undefined;
        }

        this.languageSelectorDisplay(res.data.length);
      });
  }

  public ngOnDestroy(): void {
    this.getLanguagesListSubscribe.unsubscribe();
  }

  public languageSelectorDisplay(langCount: number): void {
    let parentElement: HTMLElement = this.element.parentElement;

    if (parentElement.classList.contains('language-selector') || parentElement.classList.contains('language-selector-header')) {
      if (langCount < this.languageCountToShow) {
        parentElement.classList.add('hidden');
      }
    }
  }

  public changeLanguage(lang: string): void {
    if (this.currentLanguage === lang) {
      return;
    }

    this.localStorageService.setItem('language', lang);

    this.window.location.href = this.window.location.href.replace(`lang=${this.currentLanguage}`, `lang=${lang}`);
  }
}
