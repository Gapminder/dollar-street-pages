import { Injectable } from '@angular/core';

@Injectable()
export class MathService {
  public round(income: number, dec: boolean = false): string | number {
    if (!income) {
      return 0;
    }

    return dec ? parseFloat(income.toString()).toFixed(2) : Math.round(income).toString();
  }
}
