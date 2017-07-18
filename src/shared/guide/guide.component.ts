import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { find, difference } from 'lodash';
import { GuideService } from './guide.service';
import {
  LocalStorageService,
  LanguageService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStore } from '../../interfaces';
import { AppActions } from '../../app/app.actions';

@Component({
  selector: 'quick-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})

export class GuideComponent implements OnInit, OnDestroy {
  @Output()
  public startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  public localStorageService: LocalStorageService;
  public isShowGuide: boolean;
  public description: string;
  public bubbles: any[];
  public isShowBubble: boolean = false;
  public guideService: GuideService;
  public guideServiceSubscribe: Subscription;
  public element: HTMLElement;
  public languageService: LanguageService;

  public constructor(guideService: GuideService,
                     localStorageService: LocalStorageService,
                     languageService: LanguageService,
                     element: ElementRef,
                     private store: Store<AppStore>,
                     private appActions: AppActions) {
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

  public openQuickTour(): void {
    this.isShowGuide = false;
    this.isShowBubble = true;
    this.startQuickGuide.emit({});
  }

  public closeQuickGuide(): void {
    this.isShowGuide = false;
    this.isShowBubble = false;
    this.startQuickGuide.emit({});
    this.localStorageService.setItem('quick-guide', true);
    this.store.dispatch(this.appActions.openQuickGuide(false));
  }
}
