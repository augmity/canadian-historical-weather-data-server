# Canadian Historical Weather Data (server)

A GraphQL server written in NodeJS that provides historical weather data from [https://climate.weather.gc.ca](https://climate.weather.gc.ca)

Uses [https://www.apollographql.com/](https://www.apollographql.com/) server library.

## Demo

[https://historical-weather-data-canada.herokuapp.com/](https://historical-weather-data-canada.herokuapp.com/)

## Updating the Weather Stations data

- Download the most up-to-date version of the canadian weather stations CSV file from here: https://drive.google.com/open?id=1egfzGgzUb0RFu_EE5AYFZtsyXPfZ11y2
- Save it in the root folder of this project as `data.csv`
- IMPORTANT! Remove all the lines before the CSV header in the `data.csv` file. For some reason the first three lines or so are just comments.
- Run `npm update-weather-stations`
- Commit the changes to the git repository, rebuild the server
