import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, Output, Inject, ElementRef } from '@angular/core';
import { SocialShareButtonsComponent } from '../../social_share_buttons/social-share-buttons.component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { EventEmitter } from '@angular/compiler/src/facade/async';

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
  protected step:number = 1;
  protected bubble:any = {};
  protected windowInnerWidth:number = window.innerWidth;
  protected position:any = {left: this.windowInnerWidth / 2 - 228, top: -1000};
  protected isCloseBubble:boolean = false;

  @Input('bubbles')
  private bubbles:any[];
  @Output('closeBubble')
  private closeBubble:EventEmitter<any> = new EventEmitter<any>();
  private keyUpSubscribe:any;
  private element:HTMLElement;

  public constructor(@Inject(ElementRef) element:ElementRef) {
    this.element = element.nativeElement;
  }

  public ngOnInit():void {
    this.getBubble(this.step);

    this.keyUpSubscribe = fromEvent(document, 'keyup')
      .subscribe((e:KeyboardEvent) => {
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

  public ngOnDestroy():void {
    this.keyUpSubscribe.unsubscribe();
  }

  protected back():void {
    if (this.step === 1) {
      return;
    }

    this.step -= 1;
    this.getBubble(this.step);
  }

  protected next():void {
    if (this.step === this.bubbles.length) {
      return;
    }

    this.step += 1;
    this.getBubble(this.step);
  }

  protected close():void {
    this.closeBubble.emit({});
  }

  protected finish():void {
    this.getBubble(6);

    localStorage.setItem('quick-guide', 'true');
  }

  private getBubble(step:number):void {
    let baloonDirector:string;

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
      this.getCoords(baloonDirector, (data:any) => {
        if (step === 1 || step === 4 || step === 5) {
          data.left = this.windowInnerWidth / 2 - 228;
        }

        if (step === 3) {
          data.left = data.left - 125;
        }

        if (step === 6) {
          data.top = (data.top - data.height / 2) - 198.5;
          data.left = (data.left + data.width / 2) - 228;
          this.isCloseBubble = true;
        }

        this.position = data;
      });
    });
  }

  private getCoords(querySelector:string, cb:any):any {
    let box:any = document.querySelector(querySelector).getBoundingClientRect();

    let body:HTMLElement = document.body;
    let docEl:HTMLElement = document.documentElement;

    let scrollTop:number = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft:number = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    let clientTop:number = docEl.clientTop || body.clientTop || 0;
    let clientLeft:number = docEl.clientLeft || body.clientLeft || 0;

    let top:number = box.top;
    let left:number = box.left + scrollLeft - clientLeft;

    if (querySelector === '.income-title-desktop') {
      top = box.top - clientTop - 14;
    }

    if (querySelector === '.images-container') {
      top = box.top + scrollTop - clientTop;
      left = box.left + scrollLeft - clientLeft + 40;
    }

    if (querySelector === '.street-box') {
      top = box.top - clientTop - 3;
      left = box.left + scrollLeft - clientLeft + 40;
    }

    cb({top: Math.round(top) + 66, left: Math.round(left) - 20, width: box.width, height: box.height});
  }
}
