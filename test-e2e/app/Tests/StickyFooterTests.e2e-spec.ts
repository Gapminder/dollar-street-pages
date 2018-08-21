// import { browser } from 'protractor';
//
// import { DataProvider } from '../Data/DataProvider';
// import { AbstractPage, MatrixPage } from '../Pages';
// import { scrollIntoView } from '../Helpers/commonHelper';
//
// describe('Matrix Page sticky footer test', () => {
//   beforeAll(async () => {
//     await browser.get(MatrixPage.url);
//     await MatrixPage.waitForSpinner();
//   });
//
//   xit('Scroll down and check texts, icons', async () => {
//     await scrollIntoView(MatrixPage.familyLink.get(13));
//
//     const footerText = await MatrixPage.getFloatFooterText.first().getText();
//
//     expect(footerText).toEqual('Share:');
//
//     for (const [name, { element }] of Object.entries(DataProvider.stickyFooterIcons)) {
//       expect(await element().isDisplayed()).toBeTruthy();
//     }
//   });
//
//   afterAll(async () => {
//     await MatrixPage.getAngleUp.click();
//     expect(await MatrixPage.filterByThing.isDisplayed()).toBeTruthy();
//     expect(await AbstractPage.getEC().invisibilityOf(MatrixPage.getFloatFooterText.last())).toBeTruthy();
//   });
// });
