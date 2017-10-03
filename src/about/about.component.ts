import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import {
  LoaderService,
  TitleHeaderService,
  LanguageService
} from '../common';
import { AboutService } from './about.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  public about: any;
  public aboutContent: SafeHtml;
  public aboutSubscription: Subscription;
  public getTranslationSubscription: Subscription;

  public constructor(private aboutService: AboutService,
                     private loaderService: LoaderService,
                     private titleHeaderService: TitleHeaderService,
                     private languageService: LanguageService) {
  }

  public ngAfterViewInit(): void {
    this.loaderService.setLoader(false);

    this.getTranslationSubscription = this.languageService.getTranslation('ABOUT').subscribe((trans: any) => {
      this.titleHeaderService.setTitle(trans);
    });

    this.aboutSubscription = this.aboutService.getInfo(this.languageService.getLanguageParam()).subscribe((val: any) => {
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
    if (this.aboutSubscription) {
      this.aboutSubscription.unsubscribe();
    }

    if (this.getTranslationSubscription) {
      this.getTranslationSubscription.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }
}
