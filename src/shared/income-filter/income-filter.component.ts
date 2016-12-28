import { Component, Output, EventEmitter, Input, OnInit, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StreetSettingsService } from '../../common';

@Component({
  selector: 'income-filter',
  templateUrl: './income-filter.component.html',
  styleUrls: ['./income-filter.component.css']
})

export class IncomeFilterComponent implements OnInit {
  @Input('places')
  public places: any[];
  @Input('lowIncome')
  public lowIncome: number;
  @Input('highIncome')
  public highIncome: number;
  @Output('sendResponse')
  public sendResponse: EventEmitter<any> = new EventEmitter<any>();
  public range: {lowIncome: number; highIncome: number; close?: boolean} = {
    lowIncome: this.lowIncome,
    highIncome: this.highIncome
  };
  public streetData: any;
  public streetSettingsService: StreetSettingsService;
  public streetServiceSubscribe: Subscription;
  public element: HTMLElement;

  public constructor(streetSettingsService: StreetSettingsService,
                     element: ElementRef) {
    this.streetSettingsService = streetSettingsService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;

        let buttonContainer = this.element.querySelector('.income-filter-button-container') as HTMLElement;

        if (buttonContainer) {
          let captureContainer = this.element.querySelector('.income-filter-header-container') as HTMLElement;
          let shortenWidth = buttonContainer.querySelector('.show-all') as HTMLElement;
          let okayButton = buttonContainer.querySelector('.ok-button') as HTMLElement;
          let cancelButton = buttonContainer.querySelector('.close-button') as HTMLElement;
          let buttonsContainerWidth = okayButton.offsetWidth + cancelButton.offsetWidth + shortenWidth.offsetWidth + 30;

          if (buttonsContainerWidth && buttonsContainerWidth > buttonContainer.offsetWidth) {
            shortenWidth.classList.add('decreaseFontSize');
            cancelButton.classList.add('decreaseFontSize');
            okayButton.classList.add('decreaseFontSize');
            captureContainer.classList.add('decreaseFontSizeCapture');
          }
        }
      });
  }

  public closeFilter(isClose?: boolean): void {
    if (isClose) {
      this.sendResponse.emit({close: true});
      return;
    }

    this.range.close = true;

    this.sendResponse.emit(this.range);
  }

  public getFilter(data: {lowIncome: number;highIncome: number}): void {
    this.range = data;
  }

  public showAll(): void {
    this.range.lowIncome = this.streetData.poor;
    this.range.highIncome = this.streetData.rich;
    this.range.close = true;

    this.sendResponse.emit(this.range);
  }
}
