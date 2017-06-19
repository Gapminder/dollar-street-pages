import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { StreetSettingsService } from '../../common';

@Component({
  selector: 'income-filter',
  templateUrl: './income-filter.component.html',
  styleUrls: ['./income-filter.component.css']
})

export class IncomeFilterComponent implements AfterViewInit {
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
  public streetData: any;
  public streetSettingsService: StreetSettingsService;
  public streetServiceSubscribe: Subscription;
  public element: HTMLElement;

  public constructor(streetSettingsService: StreetSettingsService,
                     element: ElementRef) {
    this.streetSettingsService = streetSettingsService;
    this.element = element.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;

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

  public showAllRange(): void {
    this.range.lowIncome = this.streetData.poor;
    this.range.highIncome = this.streetData.rich;
    this.range.close = true;

    this.sendResponse.emit(this.range);
  }
}
