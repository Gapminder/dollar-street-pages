import {Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';

let tpl = require('./incomes-filter.template.html');
let style = require('./incomes-filter.css');

@Component({
  selector: 'incomes-filter',
  template: tpl,
  styles: [style]
})

export class IncomesFilterComponent implements OnChanges {
  protected isOpenIncomesFilter:boolean = false;
  protected title:string = 'all incomes';
  protected range:{min:number; max:number;} = {min: 0, max: 0};

  @Input()
  protected activeFilter:string;

  private cloneRange:{min:number; max:number;} = {min: 0, max: 0};

  @Input()
  private url:string;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter();
  @Output()
  private activatedFilter:EventEmitter<any> = new EventEmitter();

  protected openCloseIncomesFilter(isOpenIncomesFilter:boolean, isOnChanges?:boolean):void {
    this.isOpenIncomesFilter = !isOpenIncomesFilter;

    if (!this.isOpenIncomesFilter) {
      this.range = JSON.parse(JSON.stringify(this.cloneRange));
    }

    if (!isOnChanges) {
      this.activatedFilter.emit(this.isOpenIncomesFilter ? 'incomes' : '');
    }
  }

  protected applyFilter(minIncome:any, maxIncome:any):void {
    this.isOpenIncomesFilter = false;
    let query = this.parseUrl(this.url);

    minIncome = Math.abs(minIncome);
    maxIncome = Math.abs(maxIncome) <= 15000 ? Math.abs(maxIncome) : 15000;

    if (minIncome >= 15000) {
      minIncome = maxIncome - 100;
    }

    if (minIncome >= maxIncome) {
      maxIncome = minIncome + 100;
    }

    if (maxIncome > 15000 && minIncome > 14990) {
      minIncome = 14900;
      maxIncome = 15000;
    }

    if (minIncome === 0 && minIncome >= maxIncome) {
      minIncome = 0;
      maxIncome = 100;
    }

    query.lowIncome = minIncome;
    query.highIncome = maxIncome;

    this.range.min = query.lowIncome;
    this.range.max = query.highIncome;

    this.title = this.getTitle(this.range);

    this.cloneRange = JSON.parse(JSON.stringify(this.range));
    this.selectedFilter.emit({url: this.objToQuery(query)});
  }

  public ngOnChanges(changes:any):void {
    if (changes.url && changes.url.currentValue) {
      let query = this.parseUrl(this.url);

      this.range.min = Math.abs(query.lowIncome);
      this.range.max = Math.abs(query.highIncome);

      this.cloneRange = JSON.parse(JSON.stringify(this.range));

      this.title = this.getTitle(this.range);
    }

    if (
      this.isOpenIncomesFilter &&
      changes.activeFilter &&
      changes.activeFilter.currentValue
      && changes.activeFilter.currentValue !== 'incomes'
    ) {
      this.openCloseIncomesFilter(true, true);
    }
  }

  private getTitle(range:any):string {
    let title:string;

    if (range.min > 0 && range.max < 15000) {
      title = 'incomes $' + range.min + ' - $' + range.max;
    }

    if (range.min > 0 && range.max === 15000) {
      title = 'income over $' + range.min;
    }

    if (range.min === 0 && range.max < 15000) {
      title = 'income lower $' + range.max;
    }

    return title || 'all incomes';
  }

  private objToQuery(data:any):string {
    return Object.keys(data).map((k:string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url:string):any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }
}
