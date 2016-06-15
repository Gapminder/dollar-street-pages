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
  protected range:{min:number; max:number;} = {};
  private cloneRange:{min:number; max:number;} = {};

  @Input()
  private url:string;
  @Output()
  private selectedFilter:EventEmitter<any> = new EventEmitter();

  protected openIncomesFilter(isOpenIncomesFilter:boolean):void {
    this.isOpenIncomesFilter = !isOpenIncomesFilter;
  }

  protected incomeFilter(minIncome:any, maxIncome:any):void {
    minIncome = minIncome ? Math.abs(minIncome) : '';
    maxIncome = maxIncome ? Math.abs(maxIncome) : '';

    this.range.min = minIncome;
    this.range.max = maxIncome > 15000 ? 15000 : maxIncome;
  }

  protected applyFilter():void {
    this.isOpenIncomesFilter = false;
    let query = this.parseUrl(this.url);

    query.lowIncome = Math.abs(this.range.min);
    query.highIncome = Math.abs(this.range.max);

    if (query.lowIncome >= query.highIncome) {
      query.highIncome = query.lowIncome + 10;
    }

    if (query.highIncome > 15000 && query.lowIncome > 14990) {
      query.lowIncome = 14990;
      query.highIncome = 15000;
    }

    if (query.lowIncome === 0 && query.lowIncome >= query.highIncome) {
      query.lowIncome = 0;
      query.highIncome = 10;
    }

    this.range.min = query.lowIncome;
    this.range.max = query.highIncome;

    this.cloneRange = JSON.parse(JSON.stringify(this.range));
    this.selectedFilter.emit({url: this.objToQuery(query)});
  }

  protected closeFilter():void {
    this.isOpenIncomesFilter = false;

    this.range = JSON.parse(JSON.stringify(this.cloneRange));
  }

  public ngOnChanges(changes:any):void {
    if (changes.url.currentValue) {
      let query = this.parseUrl(this.url);

      this.range.min = Math.abs(query.lowIncome);
      this.range.max = Math.abs(query.highIncome);

      this.cloneRange = JSON.parse(JSON.stringify(this.range));

      if (this.range.min > 0 && this.range.max < 15000) {
        this.title = 'incomes $' + this.range.min + ' - $' + this.range.max;

        return;
      }

      if (this.range.min > 0 && this.range.max === 15000) {
        this.title = 'income over $' + this.range.min;

        return;
      }

      if (this.range.min === 0 && this.range.max < 15000) {
        this.title = 'income lower $' + this.range.max;
      }
    }
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
