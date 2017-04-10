import { Component, ElementRef, AfterViewChecked, Input } from '@angular/core';

export interface AccordionDataInterface {
    sectionName: string;
    sectionContent: string;
}

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements AfterViewChecked {
  public accordionAdded: boolean;

  @Input()
  public accordionData: AccordionDataInterface[];

  public constructor(public elementRef: ElementRef) {
  }

  public ngAfterViewChecked(): void {
      this.addAccordionScript();
  }

  public addAccordionScript(): void {
      if(this.accordionAdded) {
          return;
      } else {
          this.accordionAdded = true;
      }

      let accordionElement: HTMLElement = this.elementRef.nativeElement as HTMLElement;
      let accordionTitleList: NodeListOf<Element> = accordionElement.querySelectorAll('.accordion-title');
      let accordionTitles: Element[] = Array.prototype.slice.call(accordionTitleList);

      accordionTitles.forEach((accordionTitle: HTMLElement) => {
          accordionTitle.addEventListener('click', (event: any) => {
              let target = event.target as HTMLElement;

              let panel = target.parentElement.nextElementSibling as HTMLElement;
              let arrow = target.nextElementSibling as HTMLElement;

              accordionTitles.forEach((currentTitle: HTMLElement) => {
                  if (currentTitle !== target) {
                      let targetEl = currentTitle as HTMLElement;

                      let panelEl = targetEl.parentElement.nextElementSibling as HTMLElement;
                      let arrowEl = targetEl.nextElementSibling as HTMLElement;

                      // tslint:disable-next-line
                      panelEl.style.maxHeight = null;

                      arrowEl.classList.remove('accordion-arrow-active');
                  }
              });

              if (panel.style.maxHeight) {
                  // tslint:disable-next-line
                  panel.style.maxHeight = null;

                  arrow.classList.remove('accordion-arrow-active');
              } else {
                  panel.style.maxHeight = panel.scrollHeight + 'px';

                  arrow.classList.add('accordion-arrow-active');
              }
          });
      });
    }
}
