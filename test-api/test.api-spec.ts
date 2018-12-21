const requestPromise = require('request-promise');
const sources = require('./test-data/places.json');

describe('Health-check for ', () => {
  sources.forEach((data) => {
    it(`house ${data}`, async () => {
      const uri = `https://consumer-api-prod.dollarstreet.org/v1/matrix-view-block/?placeId=${data}&thingId=Families`;
      const result = await requestPromise({
        "method": "GET",
        "uri": uri,
        "json": true,
        "headers": {}
      });

      const thingsArr = [result.data.houseImage, result.data.familyImage];
      const brokenImages = thingsArr.filter(item => item === null);

      expect(brokenImages.length).toBeLessThan(2);

    }, 15000);
  });
});
