export class MathService {
  public round(income: number): string | number {
    if (!income) {
      return 0;
    }

    let roundIncome: number = Math.round(income);

    return roundIncome.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
}
