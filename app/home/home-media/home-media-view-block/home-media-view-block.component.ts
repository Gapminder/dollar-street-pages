import { Component, Input, Inject, Output, OnChanges, NgZone, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

let tpl = require('./home-media-view-block.template.html');
let style = require('./home-media-view-block.css');

@Component({
  selector: 'home-media-view-block',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES]
})

export class HomeMediaViewBlockComponent implements OnChanges {
  protected loader:boolean = false;
  protected popIsOpen:boolean = false;
  protected fancyBoxImage:string;

  @Input('imageData')
  private imageData:any;

  @Output('closeBigImageBlock')
  private closeBigImageBlock:EventEmitter<any> = new EventEmitter<any>();

  private zone:NgZone;

  public constructor(@Inject(NgZone) zone:NgZone) {
    this.zone = zone;
  }

  public ngOnChanges(changes:any):void {
    if (changes.imageData) {
      this.loader = false;

      let image:any = new Image();

      image.onload = () => {
        this.zone.run(() => {
          this.loader = true;
        });
      };

      image.src = this.imageData.image;
    }
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

  protected closeImageBlock():void {
    this.closeBigImageBlock.emit({});
  }
}
