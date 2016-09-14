import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

let tpl = require('./team.template.html');
let style = require('./team.css');

@Component({
  selector: 'team',
  template: tpl,
  styles: [style]
})

export class TeamComponent implements OnInit, OnDestroy {
  private teamList: any;
  private teamService: any;
  private teamSubscribe: Subscription;
  private titleHeaderService: any;
  private loaderService: any;

  public constructor(@Inject('TeamService') teamService: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
    this.teamService = teamService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);
    this.titleHeaderService.setTitle('Dollar Street Team');

    this.teamSubscribe = this.teamService.getTeam()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.teamList = res.data;
        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.teamSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
