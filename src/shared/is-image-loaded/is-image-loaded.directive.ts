import { Directive, OnInit, Input, Output, NgZone, ElementRef, EventEmitter } from '@angular/core';

@Directive({selector: '[isImageLoaded]'})
export class IsImageLoadedDirective implements OnInit {
  @Input('imageLoadedUrl')
  public imageLoadedUrl: string;

  @Output('imageLoadedEvent')
  public imageLoadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public zone: NgZone;
  public element: HTMLElement;

  public constructor(zone: NgZone,
                     element: ElementRef) {
    this.zone = zone;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    let img = new Image();

    img.onload = () => {
      this.zone.run(() => {
        this.imageLoadedEvent.emit(true);
      });
    };

    img.src = this.imageLoadedUrl;
  }
}
