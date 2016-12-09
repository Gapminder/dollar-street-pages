import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamService } from './team.service';
import { LoaderService, TitleHeaderService } from '../common';
import { TranslateService } from 'ng2-translate';

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
  public translate: TranslateService;
  public teamTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetTeamSubscribe: Subscription;
  public getLanguage: string = 'fr';

  public constructor(teamService: TeamService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     translate: TranslateService) {
    this.translate = translate;
    this.teamService = teamService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.translateGetTeamSubscribe = this.translate.get('TEAM').subscribe((res: any) => {
      this.teamTranslate = res;
      this.titleHeaderService.setTitle('Dollar Street ' + this.teamTranslate);
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const teamTranslation = event.translations;
      this.teamTranslate = teamTranslation.TEAM;
      this.titleHeaderService.setTitle('Dollar Street ' + this.teamTranslate);
    });

    this.teamSubscribe = this.teamService.getTeam(`lang=${this.getLanguage}`)
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
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (    this.translateGetTeamSubscribe.unsubscribe) {
      this.translateGetTeamSubscribe.unsubscribe();
    }

    this.teamSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
