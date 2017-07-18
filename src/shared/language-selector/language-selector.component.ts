import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LanguageService } from '../../common';

import * as _ from 'lodash';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})

export class LanguageSelectorComponent implements OnInit, OnDestroy {
  public disabled: boolean = false;
  public status: {isOpen: boolean} = {isOpen: false};
  public languageService: LanguageService;
  public getLanguagesListSubscribe: Subscription;
  public languages: any[];
  public element: HTMLElement;
  public currentLanguage: string;
  public window: Window = window;
  public defaultLanguage: any;
  public defaultSecondLanguage: any;

  public constructor(languageService: LanguageService,
                     element: ElementRef) {
    this.element = element.nativeElement;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.currentLanguage = this.languageService.currentLanguage;

    this.getLanguagesListSubscribe = this.languageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
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
      if (langCount < 2) {
        parentElement.classList.add('hidden');
      }
    }
  }

  public changeLanguage(lang: string): void {
    if (this.currentLanguage === lang) {
      return;
    }

    this.languageService.changeLanguage(lang);
  }
}
