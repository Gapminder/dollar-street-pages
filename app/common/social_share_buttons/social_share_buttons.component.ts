import { Component, OnInit } from 'angular2/core';
import {SocialShareButtonsService} from './social_share_buttons.service';

let tpl = require('./social_share_buttons.component.html');
let style = require('./social_share_buttons.component.css');

@Component({
  selector: 'social-share-buttons',
  template: tpl,
  styles: [style],
  providers: [SocialShareButtonsService]
})

export class SocialShareButtons {

  constructor(private _socialShareButtonsService: SocialShareButtonsService) { }

  public url = this._socialShareButtonsService.getUrl();

  openPopUp(originalUrl:string) {
    let left = (window.innerWidth - 490) / 2;

    let popupWin = window.open(originalUrl+this.url, "contacts",'"location, width=490, height=368, top=100, left=' + left);
    popupWin.focus();
  }
}
