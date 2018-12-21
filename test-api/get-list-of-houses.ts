const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const request = require('request-promise');
const getHousesList = 'https://consumer-api-prod.dollarstreet.org/v1/things?lang=en&thing=Families';

function generateJsonDirs() {
  const jsonData = path.join(process.cwd(), 'test-api/test-data');
  if (!fs.existsSync(jsonData)) {
    mkdirp.sync(jsonData);
  }
}

async function generateJsonFile() {
  const recievedResponse = await request({
    "method": "GET",
    "uri": getHousesList,
    "json": true,
    "headers": {
      "User-Agent": ""
    }
  });

  const listOfHouses = await recievedResponse.data.streetPlaces.map((thing) => {
    return thing._id;
  });

  fs.writeFile('./test-api/test-data/places.json', JSON.stringify(listOfHouses));
}

function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(entry => {
      const entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

rimraf(path.resolve(process.cwd(), './test-api/test-data'));
generateJsonDirs();
generateJsonFile();
