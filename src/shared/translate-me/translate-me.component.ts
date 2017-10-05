import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LanguageService } from '../../common';

@Component({
  selector: 'translate-me',
  templateUrl: './translate-me.component.html',
  styleUrls: ['./translate-me.component.css']
})
export class TranslateMeComponent implements OnInit, OnDestroy {
  public url: string = 'https://docs.google.com/a/gapminder.org/forms/d/e/1FAIpQLSdvIkRRpk0ikGYiimjtCTbCngLvIQeB6jz6KoTp2C_lciYzpw/viewform';

  public getTranslationSubscribe: Subscription;

  public infoText: string;

  public constructor(private languageService: LanguageService) {
  }

  public ngOnInit(): void {
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
