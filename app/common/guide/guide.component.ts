import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { find, difference } from 'lodash';
import { GuideService } from './guide.service';
import { LocalStorageService } from './localstorage.service';

@Component({
  selector: 'quick-guide',
  templateUrl: './guide.template.html',
  styleUrls: ['./guide.css'],
  encapsulation: ViewEncapsulation.None
})

export class GuideComponent implements OnInit, OnDestroy {
  private localStorageService: LocalStorageService;
  private isShowGuide: boolean;
  private description: string;
  private bubbles: any[];
  private isShowBubble: boolean = false;
  private guideService: GuideService;
  private guideServiceSubscribe: Subscription;

  @Output('startQuickGuide')
  private startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  public constructor(guideService: GuideService,
                     localStorageService: LocalStorageService) {
    this.guideService = guideService;
    this.localStorageService = localStorageService;
  }

  public ngOnInit(): void {
    this.isShowGuide = this.localStorageService.getItem('quick-guide');

    this.localStorageService
      .getItemEvent()
      .subscribe((data: {key: any, value?: any}): void => {
        let {key, value} = data;

        this.isShowGuide = !Boolean(key && value);
        this.startQuickGuide.emit({});
      });

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
    this.isShowBubble = false;
    this.startQuickGuide.emit({});
    this.localStorageService.setItem('quick-guide', true);
  }
}
