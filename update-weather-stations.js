const csv = require('csvtojson');
const fs = require('fs');
const moment = require('moment');

const inputFilePath='./data.csv';
const outputFilePath='./weather-stations.json';

console.log('Parsing "data.csv"..');

csv({
  noheader: false,
  headers: ['name', 'province', 'climateId', 'stationId', 'wmoId', 'tcId', 'latitudeDecimalDegrees', 'longitudeDecimalDegrees', 'latitude', 'longitude', 'elevation', 'firstYear', 'lastYear', 'hlyFirstYear', 'hlyLastYear', 'dlyFirstYear', 'dlyLastYear', 'mlyFirstYear', 'mlyLastYear']
})
.fromFile(inputFilePath)
.then((jsonObj)=>{

  console.log(jsonObj);

  const result = {
    version: moment().format('YYYY-MM-DD'),
    data: jsonObj
  }

  // Save the result
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
    console.log('Done.');
  } catch (err) {
    console.error(err)
  }
})
