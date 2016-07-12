export class MathService {
  public numberConvertation(income:number):any {
    if (!income) {
      return 0;
    }
    return income.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
}
