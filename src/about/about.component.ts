import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { AboutService } from './about.service';
import { LoaderService, TitleHeaderService } from '../common';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../shared/language-selector/language.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit, OnDestroy {
  public about: any;
  public aboutService: AboutService;
  public aboutSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public sanitizer: DomSanitizer;
  public translate: TranslateService;
  public aboutTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetAboutSubscribe: Subscription;
  public languageService: LanguageService;

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     sanitizer: DomSanitizer,
                     titleHeaderService: TitleHeaderService,
                     translate: TranslateService,
                     languageService: LanguageService) {
    this.translate = translate;
    this.sanitizer = sanitizer;
    this.aboutService = aboutService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.languageService.updateLangUrl();

    this.loaderService.setLoader(false);

    this.translateGetAboutSubscribe = this.translate.get('ABOUT').subscribe((res: any) => {
      this.aboutTranslate = res;
      this.titleHeaderService.setTitle(this.aboutTranslate);
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const aboutTranslation = event.translations;
      /* tslint:disable:no-string-literal */
      this.aboutTranslate = aboutTranslation['ABOUT'];
      /* tslint:enable:no-string-literal */
      this.titleHeaderService.setTitle(this.aboutTranslate);
    });

    this.aboutSubscribe = this.aboutService.getInfo().subscribe((val: any) => {
      if (val.err) {
        console.error(val.err);
        return;
      }

      this.about = val.data;
      this.loaderService.setLoader(true);
      this.about.context = this.sanitizer.bypassSecurityTrustHtml(this.about.context);
    });
  }

  public ngOnDestroy(): void {
    this.aboutSubscribe.unsubscribe();
    this.translateOnLangChangeSubscribe.unsubscribe();
    this.translateGetAboutSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
