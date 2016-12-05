import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { AboutService } from './about.service';
import { LoaderService, TitleHeaderService } from '../common';
import { TranslateService } from 'ng2-translate';

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

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     sanitizer: DomSanitizer,
                     titleHeaderService: TitleHeaderService,
                     translate: TranslateService) {
    this.translate = translate;
    this.sanitizer = sanitizer;
    this.aboutService = aboutService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.translateGetAboutSubscribe = this.translate.get('ABOUT').subscribe((res: any) => {
      this.aboutTranslate = res;
      this.titleHeaderService.setTitle(this.aboutTranslate);
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const aboutTranslation = event.translations;
      this.aboutTranslate = aboutTranslation.ABOUT;
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
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (this.translateGetAboutSubscribe.unsubscribe) {
      this.translateGetAboutSubscribe.unsubscribe();
    }

    this.aboutSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
