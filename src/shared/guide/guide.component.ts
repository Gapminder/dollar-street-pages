import { Component, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { find, difference } from 'lodash';
import { GuideService } from './guide.service';
import { LocalStorageService, LanguageService } from '../../common';

@Component({
  selector: 'quick-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})

export class GuideComponent implements OnInit, OnDestroy {
  public localStorageService: LocalStorageService;
  public isShowGuide: boolean;
  public description: string;
  public bubbles: any[];
  public isShowBubble: boolean = false;
  public guideService: GuideService;
  public guideServiceSubscribe: Subscription;
  public element: Element;

  public languageService: LanguageService;

  @Output('startQuickGuide')
  public startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  public constructor(guideService: GuideService,
                     localStorageService: LocalStorageService,
                     languageService: LanguageService,
                     element: ElementRef) {
    this.guideService = guideService;
    this.localStorageService = localStorageService;
    this.languageService = languageService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    this.isShowGuide = !(this.localStorageService.getItem('quick-guide'));

    this.localStorageService
      .getItemEvent()
      .subscribe((data: {key: any, value?: any}): void => {
        let {key, value} = data;

        this.isShowGuide = !Boolean(key && value);
        this.startQuickGuide.emit({});
      });

    this.guideServiceSubscribe = this.guideService.getGuide(this.languageService.getLanguageParam())
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

  public openQuickGuide(): void {
    this.isShowGuide = false;
    this.isShowBubble = true;
    this.startQuickGuide.emit({});
  }

  public close(): void {
    this.isShowGuide = false;
    this.isShowBubble = false;
    this.startQuickGuide.emit({});
    this.localStorageService.setItem('quick-guide', true);
  }
}
