import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { LoaderComponent } from '../common/loader/loader.component';

let tpl = require('./about.template.html');
let style = require('./about.css');

@Component({
  selector: 'about',
  template: tpl,
  styles: [style],
  encapsulation: ViewEncapsulation.None,
  directives: [LoaderComponent]
})

export class AboutComponent implements OnInit, OnDestroy {
  private about: any;
  private loader: boolean = true;
  private aboutService: any;
  private aboutSubscribe: Subscription;
  private titleHeaderService: any;

  public constructor(@Inject('AboutService') aboutService: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
    this.aboutService = aboutService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.titleHeaderService.setTitle('About');

    this.aboutSubscribe = this.aboutService.getInfo().subscribe((val: any) => {
      if (val.err) {
        console.error(val.err);
        return;
      }

      this.about = val.data;
      this.loader = false;
    });
  }

  public ngOnDestroy(): void {
    this.aboutSubscribe.unsubscribe();
  }
}
