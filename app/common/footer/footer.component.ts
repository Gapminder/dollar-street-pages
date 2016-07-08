import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [RouterLink, SocialShareButtonsComponent],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent implements OnInit, OnDestroy {
  protected footerData:any = {};
  private footerService:any;
  private footerServiceSubscribe:any;

  public constructor(@Inject('FooterService') footerService:any) {
    this.footerService = footerService;
  }

  public ngOnInit():any {
    this.footerServiceSubscribe = this.footerService.getFooter()
      .subscribe((val:any) => {
        if (val.err) {
          return;
        }
        this.footerData = val.data;
      });
  }

  public ngOnDestroy():void {
    this.footerServiceSubscribe.unsubscribe();
  }
}
