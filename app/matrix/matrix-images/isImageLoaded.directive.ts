import { Directive, OnInit, Input, Output, NgZone, ElementRef, EventEmitter } from '@angular/core';

@Directive({selector: '[isImageLoaded]'})
export class IsImageLoadedDirective implements OnInit {
  @Input('placeUrl')
  private placeUrl: any;

  @Output('isImgLoaded')
  private isImgLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  private zone: NgZone;
  private element: HTMLElement;

  public constructor(zone: NgZone,
                     element: ElementRef) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    let img = new Image();

    img.onload = () => {
      this.zone.run(() => {
        this.isImgLoaded.emit(true);
      });
    };
    img.src = this.placeUrl;
  }
}
