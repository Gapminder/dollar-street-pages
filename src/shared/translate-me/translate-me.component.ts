import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LanguageService } from '../../common';

@Component({
  selector: 'translate-me',
  templateUrl: './translate-me.component.html',
  styleUrls: ['./translate-me.component.css']
})
export class TranslateMeComponent implements OnInit, OnDestroy {
  public url: string = 'https://crowdin.com/project/dollar-street/';
  public languageService: LanguageService;

  public getTranslationSubscribe: Subscription;

  public infoText: string;

  public constructor(languageService: LanguageService) {
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.url = this.url + this.languageService.currentLanguage;

    this.getTranslationSubscribe = this.languageService.getTranslation('HELP_TRANSLATE_TO').subscribe((trans: any) => {
      this.infoText = `${trans} ${this.languageService.languageName}`;
    });
  }

  public ngOnDestroy(): void {
    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }
  }
}
