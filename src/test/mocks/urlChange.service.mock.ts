import { Injectable } from '@angular/core';

@Injectable()
export class UrlChangeServiceMock {
  public replaceState(path: string, query: string): void {
  }
}
