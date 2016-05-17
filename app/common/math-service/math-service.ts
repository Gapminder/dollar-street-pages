export class MathService {
  public round(income:number):number {
    if (!income) {
      return 0;
    }
    return Math.round(income);
  }
}
