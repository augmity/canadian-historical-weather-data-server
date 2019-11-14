const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server');


// Weather stations data are stored in a JSON file inside this project for simplicity.
// The original data are stored in a shared Google Drive folder in CSV format (!)
// 
// (https://drive.google.com/file/d/1egfzGgzUb0RFu_EE5AYFZtsyXPfZ11y2/view)
//
const weatherStations = JSON.parse(fs.readFileSync('weather-stations.json'));

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

  type Query {
    weatherStations: [WeatherStation]
    provinces: [String]
  }
`;

// Resolvers
const resolvers = {
  Query: {
    weatherStations: () => weatherStations,
    provinces: () => {
      // Get all the unique province names from the weather stations array
      return weatherStations
        .reduce((accumulator, item) => {
          if (accumulator.indexOf(item.province) === -1) {
            accumulator.push(item.province);
          }
          return accumulator
        }, [])
    }
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
