import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

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
  private aboutService: any;
  private aboutSubscribe: Subscription;
  private titleHeaderService: any;
  private loaderService: any;

  public constructor(@Inject('AboutService') aboutService: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
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
