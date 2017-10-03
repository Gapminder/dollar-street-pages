import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamService } from './team.service';
import { LoaderService, TitleHeaderService, LanguageService } from '../common';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit, OnDestroy {
  public teamList: any;
  public teamSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;

  public constructor(private teamService: TeamService,
                     private loaderService: LoaderService,
                     private titleHeaderService: TitleHeaderService,
                     private languageService: LanguageService) {
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
