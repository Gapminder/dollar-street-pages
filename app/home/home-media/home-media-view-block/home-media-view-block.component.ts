import { Component, OnInit, Input, NgZone, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';

let tpl = require('./home-media-view-block.template.html');
let style = require('./home-media-view-block.css');

@Component({
  selector: 'home-media-view-block',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class HomeMediaViewBlockComponent implements OnInit {
  protected loader:boolean = false;
  protected popIsOpen:boolean = false;
  protected fancyBoxImage:string;

  @Input('imageData')
  private imageData:any;

  private zone:NgZone;

  public constructor(@Inject(NgZone) zone:NgZone) {
    this.zone = zone;
  }

  public ngOnInit():void {
    let image:any = new Image();

    image.onload = () => {
      this.zone.run(() => {
        this.loader = true;
      });
    };

    image.src = this.imageData.image;
  }

  protected openPopUp():void {
    this.popIsOpen = true;

    let imgUrl = this.imageData.image.replace('desktops', 'original');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

  protected fancyBoxClose():void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }
}

