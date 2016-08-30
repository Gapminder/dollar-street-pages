import { Component, Inject, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { BubbleComponent } from './bubble/bubble.component';

let _ = require('lodash');

let tpl = require('./guide.template.html');
let style = require('./guide.css');

@Component({
  selector: 'quick-guide',
  template: tpl,
  styles: [style],
  directives: [BubbleComponent]
})

export class GuideComponent implements OnInit, OnDestroy {
  protected isShowGuide: boolean = !Boolean(localStorage.getItem('quick-guide'));
  protected description: string;
  protected bubbles: any[];
  protected isShowBubble: boolean = false;

  private guideService: any;
  private guideServiceSubscribe: Subscription;

  @Output('startQuickGuide')
  private startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  public constructor(@Inject('GuideService') guideService: any) {
    this.guideService = guideService;
  }

  public ngOnInit(): void {
    this.guideServiceSubscribe = this.guideService.getGuide()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        let welcomeHeader: any = _.find(res.data, ['name', 'welcomeHeader']);

        this.description = welcomeHeader.description;
        this.bubbles = _.difference(res.data, [welcomeHeader]);
      });
  }

  public ngOnDestroy(): void {
    this.guideServiceSubscribe.unsubscribe();
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
