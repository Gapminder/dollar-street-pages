import { Component, OnInit, OnDestroy, NgZone, Inject } from '@angular/core';
import { Subscriber } from 'rxjs/Rx';
import { LoaderComponent } from '../../common/loader/loader.component';

let tpl = require('./team-list.template.html');
let style = require('./team-list.css');

@Component({
  selector: 'team-list',
  template: tpl,
  styles: [style],
  directives: [LoaderComponent]
})

export class TeamListComponent implements OnInit, OnDestroy {
  protected isLoaded: boolean = true;
  protected teamList: any;

  private teamListService: any;
  private teamListSubscribe: Subscriber<any>;
  private zone: NgZone;

  public constructor(@Inject('TeamListService') teamListService: any,
                     @Inject(NgZone) zone: NgZone) {
    this.teamListService = teamListService;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.teamListSubscribe = this.teamListService.getTeam()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.teamList = res.data;
        this.isLoaded = false;
      });
  }

  public ngOnDestroy(): void {
    this.teamListSubscribe.unsubscribe();
  }
}
