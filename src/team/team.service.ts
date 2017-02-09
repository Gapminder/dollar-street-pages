import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Config } from '../app.config';

import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {
  public http: Http;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getTeam(query: any): Observable<any> {
    return this.http.get(`${Config.api}/v1/team?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: this.sortTeamSpecial(parseRes.data)};
    });
  }

  public sortTeamSpecial(team: any[]): any[] {
    const coreTeam = ['Anna Rosling Rönnlund', 'Ola Rosling', 'Fernanda Drumond'];
    const contributors = ['Valor Software', 'Global Data Lab', 'Mattias Lindgren', 'Martha Nicholson', 'Olof Granström', 'Mikael Arevius'];

    let coreTeamObject: any = team.find((obj: any) => {return obj.name === 'Core team';});
    let contributorObject: any = team.find((obj: any) => {return obj.name === 'Contributor';});

    let changePos = (array: string[], oldIndex: number, newIndex: number) => {
      if (newIndex >= array.length) {
        let k = newIndex - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
      }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array;
    };

    coreTeam.forEach((name: string, newIndex: number) => {
      let ambass: any = coreTeamObject.ambassadors.find((member: any) => {return member.name === name;});
      changePos(coreTeamObject.ambassadors, coreTeamObject.ambassadors.indexOf(ambass), newIndex);
    });

    contributors.forEach((name: string, newIndex: number) => {
      let ambass: any = contributorObject.ambassadors.find((member: any) => {return member.name === name;});
      changePos(contributorObject.ambassadors, contributorObject.ambassadors.indexOf(ambass), newIndex);
    });

    return [coreTeamObject, contributorObject];
  }
}
