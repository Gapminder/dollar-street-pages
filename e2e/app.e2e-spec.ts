import { DollarstreetPage } from './app.po';

describe('dollarstreet App', function() {
  let page: DollarstreetPage;

  beforeEach(() => {
    page = new DollarstreetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
