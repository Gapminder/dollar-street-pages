import {Directive, Input, Inject, OnInit, ElementRef} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';

@Directive({
  selector: '[gmContentfulSrcId]'
})
export class ContentfulImageDirective implements OnInit {
  @Input()
  private gmContentfulSrcId:string;
  @Input()
  private width:string;
  @Input()
  private height:string;
  @Input()
  private fit:string;
  private queryParams:URLSearchParams = new URLSearchParams();
  private element:ElementRef;
  private _contentful:any;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject('ContentfulService') _contentful:any) {
    this.element = element;
    this._contentful = _contentful;
  }

  public ngOnInit():void {
    this._contentful
      .create()
      .getAsset(this.gmContentfulSrcId)
      .commit()
      .map((response:Response) => response.json())
      .subscribe(
        (response:any) => {
          this.element.nativeElement.src =
            this.imageUrl(response.fields.file.url);
        }
      );
  }

  private imageUrl(url:string):string {
    if (this.width) {
      this.queryParams.set('w', this.width);
    }

    if (this.height) {
      this.queryParams.set('h', this.height);
    }

    if (this.fit) {
      this.queryParams.set('fit', this.fit);
    }

    return `${url}?${this.queryParams.toString()}`;
  }
}
