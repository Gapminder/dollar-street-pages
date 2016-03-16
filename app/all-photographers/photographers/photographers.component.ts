import {Component, OnInit, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

import {PhotographersService} from './photographers.service';
import {PhotographersFilter} from './photographersFilter.pipe';

import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./photographers.component.html');
let style = require('./photographers.component.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On, LoaderComponent],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit {
  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;
  public photographersService:PhotographersService;
  public photographersByCountry:any[] = [];
  public photographersByName:any[] = [];
  private search:any = {text: ''};
  public loader:boolean = false;

  constructor(@Inject(PhotographersService) photographersService:any,
              @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.photographersService = photographersService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  ngOnInit():void {
    this.photographersService.getPhotographers({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographersByCountry = res.data.countryList;
        this.photographersByName = res.data.photographersList;
        this.loader = true;

      });
  }
}
