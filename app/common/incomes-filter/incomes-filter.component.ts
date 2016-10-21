import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { StreetSettingsService } from '../street/street.settings.service';

@Component({
  selector: 'incomes-filter',
  templateUrl: './incomes-filter.template.html',
  styleUrls: ['./incomes-filter.css']
})

export class IncomesFilterComponent implements OnInit, OnChanges, OnDestroy {
  protected isOpenIncomesFilter: boolean = false;
  protected title: string = 'all incomes';
  protected range: {min: number; max: number;} = {min: 0, max: 0};

  @Input()
  private url: string;
  @Output()
  private selectedFilter: EventEmitter<any> = new EventEmitter<any>();
  private cloneRange: {min: number; max: number;} = {min: 0, max: 0};
  private streetSettingsService: StreetSettingsService;
  private streetData: any;
  private streetServiceSubscribe: Subscription;
  private element: ElementRef;

  public constructor(streetSettingsService: StreetSettingsService,
                     element: ElementRef) {
    this.streetSettingsService = streetSettingsService;
    this.element = element;
  }

  public ngOnInit(): void {
    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

        if (this.range) {
          this.title = this.getTitle(this.range);
        }
      });
  }

  public ngOnDestroy(): void {
    this.streetServiceSubscribe.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  public isOutsideIncomeFilterClick(event: Event): void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenIncomesFilter) {
      this.openCloseIncomesFilter(true);
    }
  }

  protected openCloseIncomesFilter(isOpenIncomesFilter: boolean): void {
    this.isOpenIncomesFilter = !isOpenIncomesFilter;

    if (!this.isOpenIncomesFilter) {
      this.range = JSON.parse(JSON.stringify(this.cloneRange));
    }
  }

  protected applyFilter(minIncome: any, maxIncome: any): void {
    let poor: any = this.streetData.poor;
    let rich: any = this.streetData.rich;

    this.isOpenIncomesFilter = false;
    let query = this.parseUrl(this.url);

    minIncome = Math.abs(minIncome);
    maxIncome = Math.abs(maxIncome) <= rich ? Math.abs(maxIncome) : rich;

    if (minIncome >= rich) {
      minIncome = maxIncome - 100;
    }

    if (minIncome >= maxIncome) {
      maxIncome = minIncome + 100;
    }

    if (maxIncome > rich && minIncome > (rich - 10)) {
      minIncome = rich - 100;
      maxIncome = rich;
    }

    if (minIncome === poor && minIncome >= maxIncome) {
      minIncome = poor;
      maxIncome = 100;
    }

    minIncome = minIncome < poor ? poor : minIncome;
    maxIncome = maxIncome > rich ? rich : maxIncome;

    query.lowIncome = minIncome;
    query.highIncome = maxIncome;

    this.range.min = query.lowIncome;
    this.range.max = query.highIncome;

    if (this.streetData) {
      this.title = this.getTitle(this.range);
    }

    this.cloneRange = JSON.parse(JSON.stringify(this.range));
    this.selectedFilter.emit({url: this.objToQuery(query)});
  }

  public ngOnChanges(changes: any): void {
    if (changes.url && changes.url.currentValue) {
      let query = this.parseUrl(this.url);

      this.range.min = Math.abs(query.lowIncome);
      this.range.max = Math.abs(query.highIncome);

      this.cloneRange = JSON.parse(JSON.stringify(this.range));

      if (this.streetData) {
        this.title = this.getTitle(this.range);
      }
    }
  }

  private getTitle(range: any): string {
    let poor: number = this.streetData.poor;
    let rich: number = this.streetData.rich;

    let title: string;

    if (range.min > poor && range.max < rich) {
      title = ' $ ' + this.fillSpaces(range.min) + ' – ' + this.fillSpaces(range.max);
    }

    if (range.min > poor && range.max === rich) {
      title = 'income over $ ' + this.fillSpaces(range.min);
    }

    if (range.min === poor && range.max < rich) {
      title = 'income lower $ ' + this.fillSpaces(range.max);
    }

    return title || 'all incomes';
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }

  private fillSpaces(income: any): string {
    return income.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  };
}
