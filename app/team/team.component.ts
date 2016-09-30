import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamService } from './team.service';
import { LoaderService } from '../common/loader/loader.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./team.template.html');
let style = require('./team.css');

@Component({
  selector: 'team',
  template: tpl,
  styles: [style]
})

export class TeamComponent implements OnInit, OnDestroy {
  private teamList: any;
  private teamService: TeamService;
  private teamSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;
  private loaderService: LoaderService;

  public constructor(teamService: TeamService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService) {
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
