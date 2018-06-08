import { Injectable } from '@angular/core';

@Injectable()
export class MathServiceMock {
  public roundIncome(income: number = 0, decimal: boolean = false): string | number {
    return decimal ? income.toFixed(2) : Math.round(income).toString();
  }

  public round(income: number = 0): string | number {
    return Math.round(income).toString();
  }
}
