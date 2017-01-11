import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamService } from './team.service';
import { LoaderService, TitleHeaderService } from '../common';
import { LanguageService } from '../common';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit, OnDestroy {
  public teamList: any;
  public teamService: TeamService;
  public teamSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;

  public constructor(teamService: TeamService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService) {
    this.teamService = teamService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.getTranslationSubscribe = this.languageService.getTranslation('TEAM').subscribe((trans: any) => {
      this.titleHeaderService.setTitle('Dollar Street ' + trans);
    });

    this.teamSubscribe = this.teamService.getTeam(this.languageService.getLanguageParam())
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
    this.getTranslationSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
