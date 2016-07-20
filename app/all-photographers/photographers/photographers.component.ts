import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { PhotographersFilter } from './photographers-filter.pipe.ts';
import { LoaderComponent } from '../../common/loader/loader.component';

let tpl = require('./photographers.template.html');
let style = require('./photographers.css');

@Component({
  selector: 'photographers-list',
  template: tpl,
  styles: [style],
  directives: [RouterLink, LoaderComponent],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit, OnDestroy {
  protected math:any;
  private photographersService:any;
  private photographersByCountry:any[];
  private photographersByName:any[];
  private search:any;
  private loader:boolean;
  private photographersServiceSubscribe:any;

  public constructor(@Inject('PhotographersService') photographersService:any,
                     @Inject('Math') math:any) {
    this.photographersService = photographersService;
    this.photographersByCountry = [];
    this.photographersByName = [];
    this.math = math;
    this.search = {text: ''};
    this.loader = false;
  }

  public ngOnInit():void {
    this.photographersServiceSubscribe = this.photographersService.getPhotographers()
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographersByCountry = res.data.countryList;
        this.photographersByName = res.data.photographersList;
        this.loader = true;
      });
  }

  public ngOnDestroy():void {
    this.photographersServiceSubscribe.unsubscribe();
  }

  public toggleLeftSide(e:Event):void {
    let element = e.target as HTMLElement;
    let parent = element.parentNode as HTMLElement;
    parent.classList.toggle('show');
  }
}
