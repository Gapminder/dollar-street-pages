import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { AboutService } from './about.service';
import { LoaderService } from '../common/loader/loader.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./about.template.html');
let style = require('./about.css');

@Component({
  selector: 'about',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})

export class AboutComponent implements OnInit, OnDestroy {
  private about: any;
  private aboutService: AboutService;
  private aboutSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;
  private loaderService: LoaderService;

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService) {
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
    });
  }

  public ngOnDestroy(): void {
    this.aboutSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
