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
import { AppStates, LanguageState, SubscriptionsList } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { DEBOUNCE_TIME } from '../../defaultState';
import { get } from 'lodash';

@Component({
  selector: 'quick-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit, OnDestroy {
  @Output()
  public startQuickGuide: EventEmitter<any> = new EventEmitter<any>();

  isShowGuide: boolean;
  description: string;
  bubbles: any[];
  isShowBubble: boolean = false;
  guideServiceSubscribe: Subscription;
  element: HTMLElement;
  localStorageServiceSubscription: Subscription;
  storeMatrixSubsdcription: Subscription;
  ngSubscriptions: SubscriptionsList = {};
  language = '';


  public constructor(elementRef: ElementRef,
                     private guideService: GuideService,
                     private localStorageService: LocalStorageService,
                     private languageService: LanguageService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;
  }

  public ngOnInit(): void {
    const guideLocalStore = this.localStorageService.getItem('quick-guide');
    this.isShowGuide = guideLocalStore === null ? true : !guideLocalStore;
    this.store.dispatch(new MatrixActions.OpenQuickGuide(this.isShowGuide));

    this.localStorageServiceSubscription = this.localStorageService
      .getItemEvent()
      .subscribe((data: {key: any, value?: any}): void => {
        let {key, value} = data;

        this.isShowGuide = !Boolean(key && value);
        this.startQuickGuide.emit({});
      });

    this.subscribeStatusQuickGuide();

    this.store
      .select((appStates: AppStates) => appStates.language)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe( (language: LanguageState) => {
        if (this.language !== language.lang) {
          this.language = language.lang;
          this.getQuideContent(this.language);
        }
      });
  }

  getQuideContent(lang: string): void {
    if (get(this.guideServiceSubscribe, 'unsubscribe', false)) {
      this.guideServiceSubscribe.unsubscribe()
    }
    this.guideServiceSubscribe = this.guideService.getGuide(`lang=${lang}`)
      .subscribe((res: any) => {
        console.log(res);
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
    this.storeMatrixSubsdcription.unsubscribe();
  }

  public openQuickTour(): void {
    this.isShowGuide = false;
    this.isShowBubble = true;
    this.startQuickGuide.emit({});
  }

  public closeQuickGuide(): void {
    this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
  }

  subscribeStatusQuickGuide(): void {
    this.storeMatrixSubsdcription = this.store.select('matrix')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(matrix => {
      if (matrix.quickGuide) {
        this.isShowGuide = true;
      } else {
        this.isShowGuide = false;
        this.isShowBubble = false;
        this.startQuickGuide.emit({});
        this.localStorageService.setItem('quick-guide', true);
      }
    });
  }
}
