import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, Inject, ElementRef, NgZone } from '@angular/core';
import { SocialShareButtonsComponent } from '../../social_share_buttons/social-share-buttons.component';
import { fromEvent } from 'rxjs/observable/fromEvent';

let _ = require('lodash');

let tpl = require('./bubble.template.html');
let style = require('./bubble.css');

@Component({
  selector: 'bubble',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtonsComponent],
  encapsulation: ViewEncapsulation.None
})

export class BubbleComponent implements OnInit, OnDestroy {
  protected step: number = 1;
  protected bubble: any = {};
  protected windowInnerWidth: number = window.innerWidth;
  protected position: any = {left: this.windowInnerWidth / 2 - 228, top: -1000};
  protected isCloseBubble: boolean = false;

  @Input('bubbles')
  private bubbles: any[];
  private keyUpSubscribe: any;
  private element: HTMLElement;
  private zone: NgZone;
  private resizeSubscribe: any;

  public constructor(@Inject(ElementRef) element: ElementRef,
                     @Inject(NgZone) zone: NgZone) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.getBubble(this.step);

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          if (this.isCloseBubble) {
            return;
          }

          this.windowInnerWidth = window.innerWidth;
          this.getBubble(this.step);
        });
      });

    this.keyUpSubscribe = fromEvent(document, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (this.isCloseBubble) {
          return;
        }

        if (e.keyCode === 37) {
          this.back();
        }

        if (e.keyCode === 39) {
          this.next();
        }
      });
  }

  public ngOnDestroy(): void {
    this.keyUpSubscribe.unsubscribe();

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }
  }

  protected back(): void {
    if (this.step === 1) {
      return;
    }

    this.step -= 1;
    this.getBubble(this.step);
  }

  protected next(): void {
    if (this.step === this.bubbles.length) {
      return;
    }

    this.step += 1;
    this.getBubble(this.step);
  }

  protected finish(): void {
    this.getBubble(6);

    localStorage.setItem('quick-guide', 'true');
  }

  private getBubble(step: number): void {
    let baloonDirector: string;

    if (step === 1) {
      baloonDirector = '.street-box';
      this.bubble = _.find(this.bubbles, ['name', 'street']);
    }

    if (step === 2) {
      baloonDirector = 'things-filter';
      this.bubble = _.find(this.bubbles, ['name', 'thing']);
    }

    if (step === 3) {
      baloonDirector = 'countries-filter';
      this.bubble = _.find(this.bubbles, ['name', 'geography']);
    }

    if (step === 4) {
      baloonDirector = '.street-box';
      this.bubble = _.find(this.bubbles, ['name', 'income']);
    }

    if (step === 5) {
      baloonDirector = '.images-container';
      this.bubble = _.find(this.bubbles, ['name', 'image']);
    }

    if (step === 6) {
      baloonDirector = 'main-menu';
    }

    setTimeout(() => {
      this.getCoords(baloonDirector, (data: any) => {
        let baloonElement: ClientRect = this.element.querySelector('.bubbles-container').getBoundingClientRect();
        let baloonWidth: number = baloonElement.width;
        let baloonHeight: number = baloonElement.height;

        data.top += data.height;

        if (step === 1 || step === 4) {
          data.left = this.windowInnerWidth / 2 - baloonWidth / 2;
        }

        if (step === 2) {
          data.top += 17;
          data.left -= 7;
        }

        if (step === 3) {
          data.top += 17;
          data.left = data.left - baloonWidth / 2 + data.width / 2;
        }

        if (step === 5) {
          data.top -= data.height;
          data.left = this.windowInnerWidth / 2 - baloonWidth / 2;
        }

        if (step === 6) {
          data.top = (data.top - data.height / 2) - baloonHeight / 2;
          data.left = (data.left + data.width / 2) - baloonWidth / 2;
          this.isCloseBubble = true;
        }

        this.position = data;
      });
    });
  }

  private getCoords(querySelector: string, cb: any): any {
    let box: any = document.querySelector(querySelector).getBoundingClientRect();

    let body: HTMLElement = document.body;
    let docEl: HTMLElement = document.documentElement;

    let scrollLeft: number = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientLeft: number = docEl.clientLeft || body.clientLeft || 0;

    let top: number = box.top;
    let left: number = box.left + scrollLeft - clientLeft;

    cb({top: Math.round(top), left: Math.round(left), width: box.width, height: box.height});
  }
}
