import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  DrawDividersInterface
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStore } from '../../interfaces';
import { AppActions } from '../../app/app.actions';

@Component({
  selector: 'income-filter',
  templateUrl: './income-filter.component.html',
  styleUrls: ['./income-filter.component.css']
})
export class IncomeFilterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('incomeFilterHeaderContainer')
  public incomeFilterHeaderContainer: ElementRef;
  @ViewChild('incomeFilterButtonContainer')
  public incomeFilterButtonContainer: ElementRef;
  @ViewChild('showAll')
  public showAll: ElementRef;
  @ViewChild('okButton')
  public okButton: ElementRef;
  @ViewChild('closeButton')
  public closeButton: ElementRef;

  @Input()
  public places: any[];
  @Input()
  public lowIncome: number;
  @Input()
  public highIncome: number;
  @Output()
  public sendResponse: EventEmitter<any> = new EventEmitter<any>();

  public range: {lowIncome: number; highIncome: number; close?: boolean} = {
    lowIncome: this.lowIncome,
    highIncome: this.highIncome
  };
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public appState: Observable<any>;
  public streetSettingsStateSubscription: Subscription;
  public appStateSubscription: Subscription;

  public constructor(store: Store<AppStore>,
                     element: ElementRef,
                     private appActions: AppActions) {
    this.element = element.nativeElement;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
    this.appState = this.store.select((dataSet: AppStore) => dataSet.app);
  }

  public ngAfterViewInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;

      this.initData();
    });
  }

  public ngOnDestroy(): void {
    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
  }

  public initData(): void {
    let buttonContainer: HTMLElement = this.incomeFilterButtonContainer.nativeElement;

    if (buttonContainer) {
      let captureContainer = this.incomeFilterHeaderContainer.nativeElement;

      let shortenWidth: HTMLElement = this.showAll.nativeElement;
      let okayButton: HTMLElement = this.okButton.nativeElement;
      let cancelButton: HTMLElement = this.closeButton.nativeElement;

      let buttonsContainerWidth = okayButton.offsetWidth + cancelButton.offsetWidth + shortenWidth.offsetWidth + 30;

      if (buttonsContainerWidth && buttonsContainerWidth > buttonContainer.offsetWidth) {
        shortenWidth.classList.add('decreaseFontSize');
        cancelButton.classList.add('decreaseFontSize');
        okayButton.classList.add('decreaseFontSize');
        captureContainer.classList.add('decreaseFontSizeCapture');
      }
    }
  }

  public closeFilter(isClose?: boolean): void {
    if (isClose) {
      this.sendResponse.emit({close: true});

      this.store.dispatch(this.appActions.openIncomeFilter(false));

      return;
    }

    this.range.close = true;

    this.sendResponse.emit(this.range);
  }

  public getFilter(data: {lowIncome: number; highIncome: number}): void {
    this.range = data;
  }

  public showAllRange(): void {
    this.range.lowIncome = this.streetData.poor;
    this.range.highIncome = this.streetData.rich;
    this.range.close = true;

    this.sendResponse.emit(this.range);

    this.store.dispatch(this.appActions.openIncomeFilter(false));
  }
}
