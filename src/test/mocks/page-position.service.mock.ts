import { Injectable } from '@angular/core';

@Injectable()
export class PagePositionServiceMock {
  findGridContainer(): void {}

  public getGridContainerRect(): void {}

  public getCurrentRow(rect): number {
    return 3;
  }

  public setCurrentRow(): void {}

  public scrollTopZero(): void {}
}
