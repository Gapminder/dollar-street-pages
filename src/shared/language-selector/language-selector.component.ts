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
    this.getLanguagesListSubscribe = this.languageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.currentLanguage = this.translate.currentLang;

        this.languages = _.filter(res.data, (language: any): any => {
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

        if (this.defaultSecondLanguage) {
          if (this.defaultSecondLanguage.code === 'en') {
            this.defaultSecondLanguage = this.languages.length ? _.first(this.languages.splice(0, 1)) : undefined;
          }
        }
      });
  }

  public ngOnDestroy(): void {
    this.getLanguagesListSubscribe.unsubscribe();
  }

  public changeLanguage(lang: string): void {
    if (this.currentLanguage === lang) {
      return;
    }

    this.localStorageService.setItem('language', lang);

    this.window.location.href = this.window.location.href.replace(`lang=${this.currentLanguage}`, `lang=${lang}`);
  }
}
