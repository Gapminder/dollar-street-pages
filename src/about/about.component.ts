import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public queryParamsSubscription: Subscription;
  public jumpToSelector: string;

  public constructor(private aboutService: AboutService,
                     private loaderService: LoaderService,
                     private titleHeaderService: TitleHeaderService,
                     private languageService: LanguageService,
                     private activatedRoute: ActivatedRoute,
                     private changeDetectorRef: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.loaderService.setLoader(false);

    this.getTranslationSubscription = this.languageService.getTranslation('ABOUT').subscribe((trans: any) => {
      this.titleHeaderService.setTitle(trans);
    });

    this.aboutSubscription = this.aboutService.getInfo(this.languageService.getLanguageParam()).subscribe((val: any) => {
      if (val.err) {
        // TODO handle the error
        console.error(val.err);
        return;
      }

      this.loaderService.setLoader(true);

      this.about = val.data;

      this.aboutContent = this.languageService.getSunitizedString(this.about.context);

      this.changeDetectorRef.detectChanges();

      let targetEl = document.getElementById(this.jumpToSelector);

      if (targetEl) {
        targetEl.scrollIntoView();
        window.scrollTo(0, window.scrollY - 80);
      }
    });

    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: any) => {
        let jumpSelector = decodeURI(params.jump);

        if(jumpSelector !== 'undefined') {
          this.jumpToSelector = jumpSelector;
        }
    });
  }

  public ngOnDestroy(): void {
    if (this.aboutSubscription) {
      this.aboutSubscription.unsubscribe();
    }

    if (this.getTranslationSubscription) {
      this.getTranslationSubscription.unsubscribe();
    }

    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }
}
