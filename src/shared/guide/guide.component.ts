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
import { AppStates } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';

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
  public localStorageServiceSubscription: Subscription;

  public constructor(guideService: GuideService,
                     localStorageService: LocalStorageService,
                     languageService: LanguageService,
                     element: ElementRef,
                     private store: Store<AppStates>) {
    this.guideService = guideService;
    this.localStorageService = localStorageService;
    this.languageService = languageService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    this.isShowGuide = !(this.localStorageService.getItem('quick-guide'));

    this.localStorageServiceSubscription = this.localStorageService
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
    this.localStorageServiceSubscription.unsubscribe();
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
    this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
  }
}
