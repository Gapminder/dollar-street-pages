import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {SocialShareButtonsComponent} from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [RouterLink, SocialShareButtonsComponent],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent {
  protected footerData:any = {};
  private footerTextService:any;
  private footerSettingsSubscribe:any;
  public constructor(@Inject('FooterService') footerTextService:any) {
    this.footerTextService = footerTextService;
  }
  public ngOnInit():any {
    this.footerSettingsSubscribe = this.footerTextService.getFooterText()
      .subscribe((val:any) => {
        if (val.err) {
          return;
        }
        this.footerData = val.data;
      });
  }
  public ngOnDestroy():void {
    if (this.footerSettingsSubscribe) {
      this.footerSettingsSubscribe.unsubscribe();
    }
   }
 }
