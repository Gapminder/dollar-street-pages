import { Directive, ElementRef, Inject, AfterViewChecked } from '@angular/core';

@Directive({selector: '[footerSpace]'})
export class FooterSpaceDirective implements AfterViewChecked {
  private footerHeight:number;
  private element:HTMLElement;

  public constructor(@Inject(ElementRef) element:ElementRef) {
    this.element = element.nativeElement;
  }

  public ngAfterViewChecked():void {
    let footer = document.querySelector('footer') as HTMLElement;

    if (!footer) {
      return;
    }

    if (this.footerHeight === footer.offsetHeight) {
      return;
    }

    this.footerHeight = footer.offsetHeight;
    this.element.style.paddingBottom = this.footerHeight + 'px';
  }
}
