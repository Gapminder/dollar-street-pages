import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewEncapsulation,
  NgZone,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { BubbleComponent } from './bubble/bubble.component';
import { find, difference } from 'lodash';

let tpl = require('./guide.template.html');
let style = require('./guide.css');

@Component({
  selector: 'quick-guide',
  template: tpl,
  styles: [style],
  directives: [BubbleComponent],
  encapsulation: ViewEncapsulation.None
})

export class GuideComponent implements OnInit, OnDestroy {
  private isShowGuide: boolean = !Boolean(localStorage.getItem('quick-guide'));
  private description: string;
  private bubbles: any[];
  private isShowBubble: boolean = false;
  private guideService: any;
  private guideServiceSubscribe: Subscription;
  private scrollSubscribe: Subscription;
  private zone: NgZone;
  private element: HTMLElement;
  private isShowGuideForScroll: boolean = true;

  @Output('reGetVisibleRows')
  private reGetVisibleRows: EventEmitter<any> = new EventEmitter<any>();

  @Output('startQuickGuide')
  private startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  public constructor(zone: NgZone,
                     @Inject('GuideService') guideService: any,
                     element: ElementRef) {
    this.guideService = guideService;
    this.zone = zone;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    this.guideServiceSubscribe = this.guideService.getGuide()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let welcomeHeader: any = find(res.data, ['name', 'welcomeHeader']);

        this.description = welcomeHeader.description;
        this.bubbles = difference(res.data, [welcomeHeader]);
      });

    if (!this.isShowGuide) {
      return;
    }

    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        if (!scrollTop) {
          this.isShowGuideForScroll = true;
          this.reGetVisibleRows.emit({});
        }

        if (scrollTop && this.isShowGuideForScroll) {
          this.isShowGuideForScroll = false;
          this.reGetVisibleRows.emit({});
        }
      });
  }

  public ngOnDestroy(): void {
    this.guideServiceSubscribe.unsubscribe();

    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  protected openQuickGuide(): void {
    this.isShowGuide = false;
    this.isShowBubble = true;
    this.startQuickGuide.emit({});
  }

  protected close(): void {
    this.isShowGuide = false;
    this.startQuickGuide.emit({});
    localStorage.setItem('quick-guide', 'true');
  }
}
