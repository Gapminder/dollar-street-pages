import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { LoaderComponent } from '../common/loader/loader.component';
import { Subscription } from 'rxjs';

let tpl = require('./team.template.html');
let style = require('./team.css');

@Component({
  selector: 'team',
  template: tpl,
  styles: [style],
  directives: [LoaderComponent]
})

export class TeamComponent implements OnInit, OnDestroy {
  protected isLoaded: boolean = true;
  protected teamList: any;

  private teamService: any;
  private teamSubscribe: Subscription;
  private titleHeaderService: any;

  public constructor(@Inject('TitleHeaderService') titleHeaderService: any,
                     @Inject('TeamService') teamService: any) {
    this.titleHeaderService = titleHeaderService;
    this.teamService = teamService;
  }

  public ngOnInit(): void {
    this.titleHeaderService.setTitle('Dollar Street Team');

    this.teamSubscribe = this.teamService.getTeam()
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
    this.teamSubscribe.unsubscribe();
  }
}
