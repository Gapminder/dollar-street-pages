import { Component, Input, OnInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { find } from 'lodash';
import { Config } from '../../../app.config';
import { LocalStorageService, BrowserDetectionService } from '../../../common';

@Component({
  selector: 'bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})

export class BubbleComponent implements OnInit, OnDestroy {
  public step: number = 1;
  public bubble: any = {};
  public windowInnerWidth: number = window.innerWidth;
  public position: any = {left: this.windowInnerWidth / 2 - 228, top: -1000};
  public isCloseBubble: boolean = false;

  @Input('bubbles')
  public bubbles: any[];
  public keyUpSubscribe: Subscription;
  public element: HTMLElement;
  public zone: NgZone;
  public resizeSubscribe: Subscription;
  public getCoordinates: Function = Config.getCoordinates;
  public localStorageService: LocalStorageService;
  public device: BrowserDetectionService;
  public isTablet: boolean;
  public isMobile: boolean;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     browserDetectionService: BrowserDetectionService,
                     localStorageService: LocalStorageService) {
    this.zone = zone;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.localStorageService = localStorageService;
  }

  public ngOnInit(): void {
    this.isTablet = this.device.isTablet();
    this.isMobile = this.device.isMobile();

    this.getBubble(this.step);

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          if (this.isCloseBubble || this.windowInnerWidth === window.innerWidth) {
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

  public back(): void {
    if (this.step === 1) {
      return;
    }

    this.step -= 1;
    this.getBubble(this.step);
  }

  public next(): void {
    if (this.step === this.bubbles.length) {
      return;
    }

    this.step += 1;
    this.getBubble(this.step);
  }

  public getBubble(step: number): void {
    let baloonDirector: string;

    if (step === 1) {
      baloonDirector = '.street-box';
      this.bubble = find(this.bubbles, ['name', 'street']);
    }

    if (step === 2) {
      baloonDirector = 'things-filter';
      this.bubble = find(this.bubbles, ['name', 'thing']);
    }

    if (step === 3) {
      baloonDirector = 'countries-filter';
      this.bubble = find(this.bubbles, ['name', 'geography']);
    }

    if (step === 4) {
      baloonDirector = '.street-box';
      this.bubble = find(this.bubbles, ['name', 'income']);
    }

    if (step === 5) {
      baloonDirector = '.matrix-header';
      this.bubble = find(this.bubbles, ['name', 'image']);
    }

    if (step === 6) {
      baloonDirector = 'main-menu';
    }

    setTimeout(() => {
      this.getCoordinates(baloonDirector, (data: any) => {
        let baloonElement: ClientRect = this.element.querySelector('.bubbles-container').getBoundingClientRect();
        let baloonWidth: number = baloonElement.width;
        let baloonHeight: number = baloonElement.height;
        data.top += data.height;

        if (this.isMobile) {
          data.left = this.windowInnerWidth / 2 - baloonWidth / 2;
          this.position = this.setBubblePositionMobile(step, data, baloonWidth, baloonHeight);
        } else {
          this.position = this.setBubblePositionDesktop(step, data, baloonWidth, baloonHeight);
        }

        if (step === 6) {
          this.localStorageService.setItem('quick-guide', true);
        }
      });
    });
  }

  public setBubblePositionMobile(step: number, data: any, baloonWidth: number, baloonHeight: number): any {
    if (step === 1) {
      data.top += 20;
    }

    if (step === 2) {
      data.top += 3;
    }

    if (step === 3) {
      data.top -= 3;
    }

    if (step === 4) {
      data.top -= 66;
    }

    if (step === 6) {
      data.top = (data.top - data.height / 2) - baloonHeight / 2;
      data.left = data.left + baloonWidth / 2 - 15;
      this.isCloseBubble = true;
    }

    return data;
  }

  public setBubblePositionDesktop(step: number, data: any, baloonWidth: number, baloonHeight: number): any {
    if (step === 1 || step === 4 || step === 5) {
      if (step === 1) {
        data.top -= 2;
      }
      data.left = this.windowInnerWidth / 2 - baloonWidth / 2;
    }

    if (step === 2) {
      data.top += 17;
      data.left -= 7;
    }

    if (step === 3) {
      if (this.isTablet) {
        data.top += 13;
      } else {
        data.top += 17;
      }

      data.left = data.left - baloonWidth / 2 + data.width / 2;
    }

    if (step === 6) {
      data.top = (data.top - data.height / 2) - baloonHeight / 2;
      data.left = (data.left + data.width / 2) - baloonWidth / 2;
      this.isCloseBubble = true;
    }

    return data;
  }
}
