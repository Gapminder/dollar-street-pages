import { Injectable } from '@angular/core';

@Injectable()
export class MathService {
  public roundIncome(income: number = 0, decimal: boolean = false): string | number {
    return decimal ? income.toFixed(2) : Math.round(income).toString();
  }
}
