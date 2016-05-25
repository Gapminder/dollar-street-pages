import {Component, Input, Inject, NgZone, OnChanges} from '@angular/core';
let tpl = require('./row-loader.template.html');
let style = require('./row-loader.css');

@Component({
  selector: 'row-loader',
  template: tpl,
  styles: [style]
})

export class RowLoaderComponent implements OnChanges {
  @Input('items')
  /* Disable tslint rule 'no-unused-variable'. Variable 'items' is used in 'ngOnChanges' */
  /* tslint:disable:no-unused-variable */
  private items:any;
  /* tslint:enable:no-unused-variable */
  @Input('itemHeight')
  private itemHeight:number;

  @Input('field')
  private field:string;

  @Input('count')
  private count:number;

  private zone:NgZone;
  private item:number = 0;
  private top:number = 0;
  private isShow:boolean = true;
  private cloneItems:any;

  public constructor(@Inject(NgZone) zone:NgZone) {
    this.zone = zone;
  }

  public ngOnChanges(changes:any):void {
    if (!changes.items || !changes.items.currentValue && !changes.items.currentValue.length) {
      return;
    }

    this.cloneItems = JSON.parse(JSON.stringify(changes.items.currentValue));

    this.isShow = true;
    this.item = 0;
    this.top = 0;

    this.zone.run(() => {
      this.isUploadItem(this.item);
    });
  }

  public isUploadItem(item:number):void {
    if (item > this.cloneItems.length - 1) {
      this.isShow = false;

      return;
    }

    let image = this.cloneItems[item];
    if (!image) {
      this.zone.run(() => {
        this.item = item + 1;
        this.isUploadItem(this.item);
      });
      return;
    }
    let img = new Image();

    img.onload = () => {
      this.item = item + 1;

      if (item !== 0 && !(item % this.count)) {
        this.top = item / this.count * this.itemHeight;
      }

      this.zone.run(() => {
        this.isUploadItem(this.item);
      });
    };

    if (image[this.field].indexOf('url(') !== -1) {
      image[this.field] = image[this.field].replace('url("', '').replace('")', '');
    }

    img.src = image[this.field];
  }
}
