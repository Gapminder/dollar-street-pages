import { Component, Input, NgZone, OnChanges, Output, EventEmitter } from '@angular/core';

let tpl = require('./row-loader.template.html');
let style = require('./row-loader.css');

@Component({
  selector: 'row-loader',
  template: tpl,
  styles: [style]
})

export class RowLoaderComponent implements OnChanges {
  protected top: number = 0;
  protected isShow: boolean = true;

  @Input('items')
  protected items: any;
  @Input('itemHeight')
  private itemHeight: number;
  @Input('field')
  private field: string;
  @Input('startPosition')
  private startPosition: number;
  @Input('visibleItems')
  private visibleItems: number;
  @Input('countInRow')
  private countInRow: number;
  @Input('viewBlockHeight')
  private viewBlockHeight: number;
  @Input('activeItem')
  private activeItem: number;
  @Output('imageIsUploaded')
  private imageIsUploaded: EventEmitter<any> = new EventEmitter<any>();

  private zone: NgZone;
  private item: number = 0;
  private cloneItems: any;
  private activeRow: number;

  public constructor(zone: NgZone) {
    this.zone = zone;
  }

  public ngOnChanges(changes: any): void {
    if (changes.items && changes.items.currentValue) {
      this.isShow = true;
      this.itemHeight = this.itemHeight || 0;
      let cloneItems: any[] = JSON.parse(JSON.stringify(this.items));

      if (!cloneItems.length) {
        return;
      }

      if (!this.startPosition || !this.item) {
        this.item = 0;
      }

      if (!this.cloneItems) {
        this.cloneItems = cloneItems;
      }

      if (
        this.item &&
        this.cloneItems.length !== cloneItems.length
      ) {
        let difference: number = cloneItems.length - this.cloneItems.length;
        this.cloneItems = cloneItems;

        if (this.cloneItems.length - this.visibleItems === this.item || difference !== this.visibleItems) {
          this.isUploadItem(this.item);
        }

        return;
      }

      this.cloneItems = cloneItems;

      if (!this.startPosition || !this.item) {
        this.item = 0;
      } else {
        this.item = this.startPosition;
      }

      this.top = this.item / this.countInRow * this.itemHeight;

      this.zone.run(() => {
        this.isUploadItem(this.item);
      });
    }

    if (changes.viewBlockHeight && this.activeItem) {
      this.activeRow = Math.ceil(this.activeItem / this.countInRow);
    }
  }

  public isUploadItem(item: number): void {
    if (item > this.cloneItems.length - 1) {
      this.isShow = false;

      return;
    }

    let image = this.cloneItems[item];

    if (!image) {
      this.zone.run(() => {
        this.item = item + 1;
        this.imageIsUploaded.emit({index: this.item - 1});
        this.isUploadItem(this.item);
      });

      return;
    }

    let img = new Image();

    img.onload = () => {
      if (this.item !== item) {
        return;
      }

      this.item = item + 1;

      if (item !== 0 && !(item % this.countInRow)) {
        this.top = item / this.countInRow * this.itemHeight;

        if (Math.ceil(item / this.countInRow) >= this.activeRow) {
          this.top += this.viewBlockHeight;
        }
      }

      this.zone.run(() => {
        this.imageIsUploaded.emit({index: this.item - 1});
        this.isUploadItem(this.item);
      });
    };

    if (image[this.field].indexOf('url(') !== -1) {
      image[this.field] = image[this.field].replace('url("', '').replace('")', '');
    }

    img.src = image[this.field];
  }
}
