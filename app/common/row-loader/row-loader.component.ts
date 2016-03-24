import {Component, Input, Inject, NgZone, OnChanges} from 'angular2/core';

let _ = require('lodash');
let tpl = require('./row-loader.template.html');
let style = require('./row-loader.css');

@Component({
  selector: 'row-loader',
  template: tpl,
  styles: [style]
})

export class RowLoaderComponent implements OnChanges {
  @Input('items')
  private items:any;

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

  constructor(@Inject(NgZone) zone) {
    this.zone = zone;
  }

  ngOnChanges(changes) {
    if (!changes.items || !changes.items.currentValue && !changes.items.currentValue.length) {
      return;
    }

    this.cloneItems = JSON.parse(JSON.stringify(changes.items.currentValue));

    this.isShow = true;
    this.item = 0;
    this.top = 0;

    this.zone.run(()=> {
      this.isUploadItem(this.item);
    });
  }

  isUploadItem(item:number) {
    if (item > this.cloneItems.length - 1) {
      this.isShow = false;

      return;
    }

    let image = this.cloneItems[item];

    let img = new Image();

    img.onload = () => {
      this.item = item + 1;

      if (item !== 0 && !(item % this.count)) {
        this.top = item / this.count * this.itemHeight;
      }

      this.zone.run(()=> {
        this.isUploadItem(this.item);
      });
    };

    if (image[this.field].indexOf('url(') !== -1) {
      image[this.field] = image[this.field].replace('url("', '').replace('")', '');
    }

    img.src = image[this.field];
  }
}
