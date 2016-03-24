import {Component, OnInit, OnDestroy, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';

import {PhotographersService} from './photographers.service';
import {PhotographersFilter} from './photographers-filter.pipe.ts';

import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./photographers.template.html');
let style = require('./photographers.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On, LoaderComponent],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit,OnDestroy {
  public photographersService:PhotographersService;
  public photographersByCountry:any[] = [];
  public photographersByName:any[] = [];
  private search:any = {text: ''};
  public loader:boolean = false;
  public photographersServiceSubscribe:any;

  constructor(@Inject(PhotographersService) photographersService:any) {
    this.photographersService = photographersService;
  }

  ngOnInit():void {
    this.photographersServiceSubscribe = this.photographersService.getPhotographers({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographersByCountry = res.data.countryList;
        this.photographersByName = res.data.photographersList;
        this.loader = true;

      });
  }

  ngOnDestroy() {
    this.photographersServiceSubscribe.unsubscribe();
  }

  toggleLeftSide(e){
    e.target.parentNode.classList.toggle('show')
  }
}
