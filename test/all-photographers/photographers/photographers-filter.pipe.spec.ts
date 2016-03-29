import {PhotographersFilter} from '../../../app/all-photographers/photographers/photographers-filter.pipe';
describe('InitCapsPipe', () => {
  let pipe:PhotographersFilter = new PhotographersFilter();
  it('firs test transform"', () => {
    expect(pipe.transform(countryList(),['Alb', countryList(), true]).length).toEqual(1);
    expect(pipe.transform(photographersList(),['Alb', countryList(), false]).length).toEqual(1);
  });
  it('second test transform"', () => {
    expect(pipe.transform(countryList(),['igor', countryList(), true]).length).toEqual(2);
    expect(pipe.transform(photographersList(),['igor', countryList(), false]).length).toEqual(2);
  });
});

function countryList() {
  return [
    {
      "name": "Albania", "photographers": [{
      "name": "AJ Sharma",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }]
    },
    {
      "name": "Bangladesh", "photographers": [{
      "name": "Igor Nepipeko",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }]
    },
    {
      "name": "Russia", "photographers": [{
      "name": "Igor Markov",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    },{
      "name": "Igor Nepipeko",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }]
    },
    {
      "name": "France", "photographers": [{
      "name": "Vladimir Loban",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }]
    }
  ]
}
function photographersList() {
  return [
    {
      "name": "AJ Sharma",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }
    ,
    {
      "name": "Igor Nepipeko",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    },
    {
      "name": "Igor Markov",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    },
    {
      "name": "Vladimir Loban",
      "userId": "56e946c4d360263447ff6fad",
      "avatar": null,
      "images": 289,
      "places": 4
    }
  ]
}
