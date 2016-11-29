import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { stringify } from '@angular/core/src/facade/lang';
import { LanguageService } from '../language-selector/language.service';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})

export class LanguageSelectorComponent implements OnInit, OnDestroy {
  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};
  public translate: TranslateService;
  public getLanguageService: LanguageService;
  public getLanguageToUseSubscribe: Subscription;
  public getLanguagesList: any;
  public element: HTMLElement;
  public currentLanguage: string;

  public constructor(getLanguageService: LanguageService,
                     element: ElementRef,
                     translate: TranslateService) {
    this.translate = translate;
    this.element = element.nativeElement;
    this.getLanguageService = getLanguageService;
  }

  public ngOnInit(): void {
    this.getLanguageToUseSubscribe = this.getLanguageService.getLanguagesList()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.getLanguagesList = res.data;
        this.currentLanguage = this.translate.currentLang;
      });
  }

  public ngOnDestroy(): void {
    if (this.getLanguageToUseSubscribe.unsubscribe()) {
      this.getLanguageToUseSubscribe.unsubscribe();
    }
  }

  public changeLanguage(lang: string): void {
    let langServ = stringify('lang=' + lang);

    this.getLanguageToUseSubscribe = this.getLanguageService.getLanguage(langServ)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.translate.setTranslation(lang, res.data.translation);
        this.translate.use(lang);
        this.currentLanguage = lang;
      });
  }
}
