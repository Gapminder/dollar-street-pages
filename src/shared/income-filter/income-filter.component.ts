import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StreetSettingsService } from '../../common';

@Component({
  selector: 'income-filter',
  templateUrl: './income-filter.component.html',
  styleUrls: ['./income-filter.component.css']
})

export class IncomeFilterComponent implements OnInit {
  @Input('places')
  protected places: any[];
  @Input('lowIncome')
  protected lowIncome: number;
  @Input('highIncome')
  protected highIncome: number;
  @Output('sendResponse')
  private sendResponse: EventEmitter<any> = new EventEmitter<any>();
  private range: {lowIncome: number; highIncome: number; close?: boolean} = {
    lowIncome: this.lowIncome,
    highIncome: this.highIncome
  };
  private streetData: any;
  private streetSettingsService: StreetSettingsService;
  private streetServiceSubscribe: Subscription;

  public constructor(streetSettingsService: StreetSettingsService) {
    this.streetSettingsService = streetSettingsService;
  }

  public ngOnInit(): void {
    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;
      });
  }

  protected closeFilter(isClose?: boolean): void {
    if (isClose) {
      this.sendResponse.emit({close: true});
      return;
    }

    this.range.close = true;

    this.sendResponse.emit(this.range);
  }

  protected getFilter(data: {lowIncome: number;highIncome: number}): void {
    this.range = data;
  }

  protected showAll(): void {
    this.range.lowIncome = this.streetData.poor;
    this.range.highIncome = this.streetData.rich;
    this.range.close = true;

    this.sendResponse.emit(this.range);
  }
}
