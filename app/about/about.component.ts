import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { AboutService } from './about.service';
import { LoaderService } from '../common/loader/loader.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'about',
  templateUrl: './about.template.html',
  styleUrls: ['./about.css'],
  encapsulation: ViewEncapsulation.None
})

export class AboutComponent implements OnInit, OnDestroy {
  private about: any;
  private aboutService: AboutService;
  private aboutSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;
  private loaderService: LoaderService;
  private sanitizer: DomSanitizer;

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     sanitizer: DomSanitizer,
                     titleHeaderService: TitleHeaderService) {
    this.sanitizer = sanitizer;
    this.aboutService = aboutService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);
    this.titleHeaderService.setTitle('About');

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
    this.loaderService.setLoader(false);
  }
}
