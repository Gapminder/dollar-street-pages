import {
  Directive,
  OnInit,
  Input,
  Output,
  NgZone,
  ElementRef,
  EventEmitter
} from '@angular/core';

@Directive({selector: '[isImageLoaded]'})
export class IsImageLoadedDirective implements OnInit {
  @Input()
  public imageLoadedUrl: string;

  @Output()
  public imageLoadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public element: HTMLElement;

  public constructor(elementRef: ElementRef,
                     private zone: NgZone) {
    this.element = elementRef.nativeElement;
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
