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
      /* tslint:disable:no-string-literal */
      this.teamTranslate = teamTranslation['TEAM'];
      /* tslint:enable:no-string-literal */
      this.titleHeaderService.setTitle('Dollar Street ' + this.teamTranslate);
    });

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
    this.translateOnLangChangeSubscribe.unsubscribe();
    this.translateGetTeamSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
