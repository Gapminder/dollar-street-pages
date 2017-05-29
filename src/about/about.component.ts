import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { AboutService } from './about.service';
import { LoaderService, TitleHeaderService, LanguageService } from '../common';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit, OnDestroy {
  public about: any;
  public aboutContent: SafeHtml;
  public aboutService: AboutService;
  public aboutSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public sanitizer: DomSanitizer;
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     sanitizer: DomSanitizer,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService) {
    this.sanitizer = sanitizer;
    this.aboutService = aboutService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.getTranslationSubscribe = this.languageService.getTranslation('ABOUT').subscribe((trans: any) => {
      this.titleHeaderService.setTitle(trans);
    });

    this.aboutSubscribe = this.aboutService.getInfo(this.languageService.getLanguageParam()).subscribe((val: any) => {
      if (val.err) {
        console.error(val.err);
        return;
      }

      this.loaderService.setLoader(true);

      this.about = val.data;

      this.aboutContent = this.languageService.getSunitizedString(this.about.context);
    });
  }

  public ngOnDestroy(): void {
    if (this.aboutSubscribe) {
      this.aboutSubscribe.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }
}
