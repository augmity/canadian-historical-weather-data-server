const fs = require('fs');
const request = require('request');
const { ApolloServer, gql } = require('apollo-server');
const csv=require('csvtojson');


// Weather stations data are stored in a JSON file inside this project for simplicity.
// The original data are stored in a shared Google Drive folder in CSV format (!)
// 
// (https://drive.google.com/file/d/1egfzGgzUb0RFu_EE5AYFZtsyXPfZ11y2/view)
//
const weatherStationsData = JSON.parse(fs.readFileSync('weather-stations.json'));
const weatherStations = weatherStationsData.data;


// Schema 
const typeDefs = gql`

  type WeatherStation {
    name: String
    province: String
    climateId: String
    stationId: Int
    wmoId: Int
    tcId: String
    latitudeDecimalDegrees: Float
    longitudeDecimalDegrees: Float
    latitude: Float
    longitude: Float
    elevation: Float
    firstYear: Int
    lastYear: Int
    hlyFirstYear: Int
    hlyLastYear: Int
    dlyFirstYear: Int
    dlyLastYear: Int
    mlyFirstYear: Int
    mlyLastYear: Int
  }

  type WeatherStationData {
    latitude: Float
    longitude: Float
    stationName: String
    climateId: String
    dateTime: String
    year: Int
    month: Int
    day: Int
    dataQuality: String
    maxTemp: Float
    maxTempFlag: String
    minTemp: Float
    minTempFlag: String
    meanTemp: Float
    meanTempFlag: String
    heatDegDays: Float
    heatDegDaysFlag: String
    coolDegDays: Float
    coolDegDaysFlag: String
    totalRain: Float
    totalRainFlag: String
    totalSnow: Float
    totalSnowFlag: String
    totalPrecip: Float
    totalPrecipFlag: String
    snowonGrnd: Float
    snowonGrndFlag: String
    dirofMaxGust: Float
    dirofMaxGustFlag: String
    spdofMaxGust: Float
    spdofMaxGustFlag: String
  }

  type Query {
    weatherStations: [WeatherStation]
    weatherStationData(stationId: Int!, year: Int!): [WeatherStationData]
    provinces: [String],
    version: String
  }
`;


// Resolvers

const getWeatherStationData = (stationId, year) => {
  const uri = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${stationId}&Year=${year}&timeframe=2`;
  const toFloat = (item) => {
    return (item && item !== '') ? parseFloat(item) : null;
  }

  return csv({
    noheader: false,
    headers: ['longitude', 'latitude', 'stationName', 'climateId', 'dateTime', 'year', 'month', 'day', 'dataQuality', 'maxTemp', 'maxTempFlag', 'minTemp', 'minTempFlag', 'meanTemp', 'meanTempFlag', 'heatDegDays', 'heatDegDaysFlag', 'coolDegDays', 'coolDegDaysFlag', 'totalRain', 'totalRainFlag', 'totalSnow', 'totalSnowFlag', 'totalPrecip', 'totalPrecipFlag', 'snowonGrnd', 'snowonGrndFlag', 'dirofMaxGust', 'dirofMaxGustFlag', 'spdofMaxGust', 'spdofMaxGustFlag'],
    colParser:{
      totalRain: toFloat,
      maxTemp: toFloat,
      minTemp: toFloat,
      meanTemp: toFloat,
      heatDegDays: toFloat,
      coolDegDays: toFloat,
      totalRain: toFloat,
      totalSnow: toFloat,
      totalPrecip: toFloat,
      snowonGrnd: toFloat,
      dirofMaxGust: toFloat,
      spdofMaxGust: toFloat,
    }
  })
  .fromStream(request.get(uri));
}

const getProvinces = () => {
  // Get all the unique province names from the weather stations array
  return weatherStations
    .reduce((accumulator, item) => {
      if (accumulator.indexOf(item.province) === -1) {
        accumulator.push(item.province);
      }
      return accumulator
    }, [])
}

const resolvers = {
  Query: {
    weatherStations: () => weatherStations,
    weatherStationData: (parent, {stationId, year}) => getWeatherStationData(stationId, year),
    provinces: getProvinces,
    version: () => weatherStationsData.version
  },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});


// The `listen` method launches a web server.
server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
