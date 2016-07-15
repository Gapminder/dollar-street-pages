export class MathService {
  public round(income:number):any {
    if (!income) {
      return 0;
    }
    let roundIncome = Math.round(income);
    return roundIncome.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
}
